import presets from '../assets/presets.json';

interface Set {
  name: string;
  code: string;
  year: number;
}

export interface PresetDeck {
  name: string;
  cards: Array<string>;
  set: Set;
}

export class PresetProvider {
  public static getDecks(): Array<PresetDeck> {
    return presets;
  }
}
