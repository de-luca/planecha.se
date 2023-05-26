import { Card, Plane } from '#/model/card';
import { MapType } from '#/model/map';
import { EternitiesMapDeckType } from '#/model/map/eternities';

export interface DeckReqs {
  mapType: MapType;
  deckType?: EternitiesMapDeckType;
}

export type CardType = 'cards' | 'planes' | 'phenomena';
export type ProceedType = 'save_use' | 'save' | 'use';
export type DeckKind = 'all' | 'planes';

export type Counts = Record<CardType, number>;
export interface SavedDeck {
  list: Array<string>;
  kind: DeckKind;
  counts: Counts;
}

export interface DeckState {
  valid: boolean;
  reqs: Array<{ valid: boolean; text: string }>;
}

export interface Requirement {
  name: string;
  type: typeof Card;
  min: number;
  max?: number;
}

type Requirements = Record<MapType, Partial<Record<CardType, Requirement>>>;
export const REQUIREMENTS: Requirements = {
  [MapType.SINGLE]: {
    planes: { name: 'Planes', type: Plane, min: 5 },
  },
  [MapType.MULTI]: {
    cards: { name: 'Cards', type: Card, min: 10, max: 10 },
    planes: { name: 'Planes', type: Plane, min: 5 },
  },
  [MapType.ETERNITIES]: {
    planes: { name: 'Planes', type: Plane, min: 25 },
  },
};

export function getDeckState(type: MapType, deck: Array<Card>): DeckState {
  const req = REQUIREMENTS[type];
  const counts = Object.keys(req).map(() => 0);
  for (const card of deck) {
    Object.values(req).forEach((r, i) => (card instanceof r.type) && counts[i]++);
  }
  const reqs = Object.values(req).map((r, i) => {
    const valid = counts[i] >= r.min && counts[i] <= (r.max ?? Infinity);
    return { valid, text: `${r.name}: ${counts[i]}/${r.min}` };
  });
  return { reqs, valid: reqs.every(r => r.valid) };
}
