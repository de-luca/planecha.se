#!/usr/bin/env bash

TMP_RAW_JSON=".tmp.json"
BACK_IMG="public/cards/back.jpg"
CARDS_JSON="src/assets/cards.json"
CARDS_DIR="public/cards/"

function prepare {
  curl -s 'https://api.scryfall.com/cards/search?q=t%3Aplane+or+t%3Aphenomenon' > $TMP_RAW_JSON
}

function clean {
  rm $TMP_RAW_JSON
}

function build_all {
  rm $CARDS_JSON
  rm $CARDS_DIR*.jpg

  build_json
  build_back
  jq -cr '.data[] | [.id, .oracle_id, .name] | @tsv' $TMP_RAW_JSON \
  | while IFS=$'\t' read -r id oracle name; do
    build_card "$id" "$oracle" "$name"
  done
}

function build_json {
  jq '
    .data 
        | [.[] 
        | {
            id: .oracle_id, 
            name: .name, 
            typeLine: .type_line, 
            oracleText: .oracle_text
          }
        ]
    ' $TMP_RAW_JSON > $CARDS_JSON

  echo "Built json file"
}

function build_back {
  curl -sL 'https://backs.scryfall.io/large/7/8/7840c131-f96b-4700-9347-2215c43156e6.jpg' | \
    convert - -resize 680 -rotate 90 $BACK_IMG
  echo "Built back img"
}

function build_card {
  curl -sL "https://api.scryfall.com/cards/$1?format=image&version=normal" | \
    convert - -resize 680 -rotate 90 "$CARDS_DIR$2.jpg"
  echo "Built card: ${3}"
}

function main {
  prepare
  build_all
  clean
}

main
