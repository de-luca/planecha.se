#!/usr/bin/env sh

curl --silent https://api.scryfall.com/cards/search?q=t%3Aplane+or+t%3Aphenomenon | \
jq '
    .data 
        | [.[] 
        | {
            id: .id, 
            oracleId: .oracle_id, 
            multiverseIds: .multiverse_ids, 
            name: .name, 
            scryfallUri: .scryfall_uri, 
            imageUris: .image_uris, 
            typeLine: .type_line, 
            oracleText: .oracle_text, 
            gathererUri: .related_uris.gatherer,
            rulingsUri: .rulings_uri,
          }
        ]
    ' > ./src/assets/cards.json