export enum Scope {
  ALL = 'all',
  PLANES = 'planes',
  PHENOMENA = 'phenomena',
}

export interface SavedDeck {
  list: Array<string>;
  scope: Scope;
}
