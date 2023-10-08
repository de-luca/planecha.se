import decks from '#assets/decks.json';

interface Set {
  name: string;
  code: string;
  year: number;
}

export interface PresetDeck {
  name: string;
  identity?: string;
  face?: Array<string>;
  cards: Array<string>;
  set: Set;
}

export class PresetProvider {
  public static getDecks(): Array<PresetDeck> {
    return decks;
  }
}
