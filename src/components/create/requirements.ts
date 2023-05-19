import { Plane, Card } from '#/model/card';
import { MapType } from '#/model/map';

interface Requirement {
  name: string;
  type: typeof Card;
  min: number;
  max?: number;
}

export const requirements: Record<MapType, Array<Requirement>> = {
  [MapType.SINGLE]: [
    { name: 'Planes', type: Plane, min: 5 },
  ],
  [MapType.MULTI]: [
    { name: 'Cards', type: Card, min: 10, max: 10 },
    { name: 'Planes', type: Plane, min: 5 },
  ],
  [MapType.ETERNITIES]: [
    { name: 'Planes', type: Plane, min: 25 },
  ],
};

export function matchRequirements(deck: Array<Card>, req: Array<Requirement>): boolean {
  const counts = req.map(() => 0);
  for (const card of deck) {
    req.forEach((r, i) => (card instanceof r.type) && counts[i]++);
  }
  return req.every((r, i) => counts[i] >= r.min && counts[i] <= (r.max ?? Infinity));
}
