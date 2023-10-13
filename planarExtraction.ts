/// <reference types="bun-types" />

import { join } from 'node:path';

export { };

interface ScryfallCard {
  oracle_id: string;
  name: string;
  type_line: string;
  oracle_text: string;
  image_uris: { normal: string };
  set: string;
  set_name: string;
  security_stamp?: string;
}

interface ScryfallResponse {
  total_cards: number;
  has_more: boolean;
  next_page?: string;
  data: Array<ScryfallCard>;
}

interface Card {
  id: string;
  name: string;
  typeLine: string;
  oracleText: string;
  sets: Array<string>;
  isUB: boolean;
}

interface Set {
  code: string;
  name: string;
}

const CARD_DIR = join(import.meta.dir, 'public', 'cards');
const API_SEARCH = 'https://api.scryfall.com/cards/search?q=(t%3Aplane+or+t%3Aphenomenon)+game%3Apaper+-is%3Apromo&unique=prints&order=released';
const CARD_BACK = 'https://backs.scryfall.io/large/7/8/7840c131-f96b-4700-9347-2215c43156e6.jpg';

async function fetchAllPrints(): Promise<Array<ScryfallCard>> {
  let nextPage: string | undefined = API_SEARCH;
  const cards: Array<ScryfallCard> = [];
  while (nextPage) {
    const raw: ScryfallResponse = await (await fetch(nextPage)).json();
    cards.push(...raw.data);
    nextPage = raw.next_page;
  }
  return cards;
}

async function buildImg(url: string, out: string): Promise<void> {
  const proc = Bun.spawn(
    [ 'convert', '-', '-resize', '680', '-rotate', '90', out ],
    { stdin: 'pipe' },
  );
  proc.stdin.write(await (await fetch(url)).arrayBuffer());
  proc.stdin.end();
  await proc.exited;
}


const cards = new Map<string, Card>();
const sets = new Map<string, Set>();

for (const print of await fetchAllPrints()) {
  const card = cards.get(print.oracle_id);
  if (!sets.has(print.set)) {
    sets.set(print.set, {
      code: print.set,
      name: print.set_name,
    });
  }
  if (card) {
    card.sets.push(print.set);
  } else {
    cards.set(print.oracle_id, {
      id: print.oracle_id,
      name: print.name,
      typeLine: print.type_line,
      oracleText: print.oracle_text,
      sets: [print.set],
      isUB: print.security_stamp === 'triangle',
    });
    await buildImg(print.image_uris.normal, join(CARD_DIR, `${print.oracle_id}.jpg`));
    console.log(`Built ${print.name}`);
  }
}

await buildImg(CARD_BACK, join(CARD_DIR, 'back.jpg'));
await Bun.write('./src/assets/cards.json', JSON.stringify([...cards.values()]));
await Bun.write('./src/assets/sets.json', JSON.stringify([...sets.values()]));
