#!/usr/bin/env bash

TMP_RAW_JSON=".tmp.json"
TMP_CARD_IDS=".card_ids"
LOCK_FILE="cards.lock"
BACK_IMG="public/cards/back.png"
CARDS_JSON="src/assets/cards.json"
CARDS_DIR="public/cards/"

function prepare {
  curl -s https://api.scryfall.com/cards/search?q=t%3Aplane+or+t%3Aphenomenon > $TMP_RAW_JSON
  jq -r '.data[].id' $TMP_RAW_JSON | sort > $TMP_CARD_IDS
}

function clean {
  rm $TMP_RAW_JSON
  rm $TMP_CARD_IDS
}

function build_all {
  rm $CARDS_JSON
  rm $CARDS_DIR*.png

  build_json
  build_back
  for id in $(jq -r '.data[].id' $TMP_RAW_JSON); do
    build_card "$id"
  done
}

function build_missing {
  if ! test -f $CARDS_JSON; then
    echo "$CARDS_JSON is missing."
    build_json
  fi

  if ! test -f $BACK_IMG; then
    echo "$BACK_IMG is missing"
    build_back
  fi

  for id in $(
    diff -u \
      .card_ids \
      <(find $CARDS_DIR ! -name 'back.png' -name '*.png' -exec basename -s .png {} \; | sort) \
      | tail -n+2 \
      | grep -E "^\-" \
      | sed -E 's/^\-//'
  ); do
    echo "Card $id is missing"
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
  curl -sL 'https://c1.scryfall.com/file/scryfall-card-backs/png/78/7840c131-f96b-4700-9347-2215c43156e6.png' | \
    convert - -rotate 90 $BACK_IMG
  echo "Built back img"
}

function build_card {
  curl -sL "https://api.scryfall.com/cards/$1?format=image&version=png" | \
    convert - -rotate 90 "$CARDS_DIR$1.png"
  echo "Built card ${id}"
}

function main {
  prepare
  if shasum -s -c $LOCK_FILE ; then
    echo "CHECKSUM MATCH - BUILDING MISSING"
    build_missing
  else
    echo "CHECKSUM DO NOT MATCH - BUILDING ALL"
    build_all
    shasum -a 256 $TMP_CARD_IDS > $LOCK_FILE
    echo "Saved ${LOCK_FILE}"
  fi
  clean
}

main
