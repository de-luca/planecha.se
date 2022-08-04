import { Card, Phenomenon, Plane } from '@/model/card';

export enum Scope {
  ALL = 'all',
  PLANES = 'planes',
  PHENOMENA = 'phenomena',
}

export interface SavedDeck {
  list: Array<string>;
  scope: Scope;
}

export const scopeMap = {
  [Scope.ALL]: Card,
  [Scope.PLANES]: Plane,
  [Scope.PHENOMENA]: Phenomenon,
};
