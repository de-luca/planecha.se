#!/usr/bin/env sh

curl --silent https://api.scryfall.com/cards/search?q=t%3Aplane+or+t%3Aphenomenon > .tmp.json

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
  ' .tmp.json > ./src/assets/cards.json

curl -L 'https://c1.scryfall.com/file/scryfall-card-backs/png/78/7840c131-f96b-4700-9347-2215c43156e6.png' | \
   convert - -rotate 90 ./src/assets/cards/back.png

for id in $(jq -r '.data[].id' .tmp.json); do
  curl --silent -L "https://api.scryfall.com/cards/$id?format=image&version=png" | \
    convert - -rotate 90 "./src/assets/cards/$id.png"
done

rm .tmp.json
