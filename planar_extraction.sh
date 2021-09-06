#!/usr/bin/env bash

TMP_RAW_JSON=".tmp.json"
BACK_IMG="public/cards/back.jpg"
CARDS_JSON="src/assets/cards.json"
CARDS_DIR="public/cards/"

function prepare {
  curl -s https://api.scryfall.com/cards/search?q=t%3Aplane+or+t%3Aphenomenon > $TMP_RAW_JSON
  jq -r '.data[].id' $TMP_RAW_JSON | sort > $TMP_CARD_IDS
}

function clean {
  rm $TMP_RAW_JSON
}

function build_all {
  rm $CARDS_JSON
  rm $CARDS_DIR*.jpg

  build_json
  build_back
  for id in $(jq -r '.data[].id' $TMP_RAW_JSON); do
    build_card "$id"
  done
}

function build_json {
  jq '
    .data 
        | [.[] 
        | {
            id: .id, 
            oracleId: .oracle_id, 
            multiverseIds: .multiverse_ids, 
            name: .name, 
            scryfallUri: .scryfall_uri, 
            typeLine: .type_line, 
            oracleText: .oracle_text, 
            gathererUri: .related_uris.gatherer,
            rulingsUri: .rulings_uri,
          }
        ]
    ' $TMP_RAW_JSON > $CARDS_JSON

  echo "Built json file"
}

function build_back {
  curl -sL 'https://c1.scryfall.com/file/scryfall-card-backs/normal/78/7840c131-f96b-4700-9347-2215c43156e6.jpg' | \
    convert - -rotate 90 $BACK_IMG
  echo "Built back img"
}

function build_card {
  curl -sL "https://api.scryfall.com/cards/$1?format=image&version=normal" | \
    convert - -rotate 90 "$CARDS_DIR$1.jpg"
  echo "Built card ${id}"
}

function main {
  prepare
  build_all
  clean
}

main
