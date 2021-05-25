import { Card } from "../card";

export interface Coordinates {
  x: number;
  y: number;
}

export enum MapType {
  EMPTY = 'empty',
  CLASSIC = 'classic',
  ETERNITIES = 'eternities',
}

export interface MapInterface {
  type: MapType;
  active: Array<Card>;
  played: Array<Card>;
  ready: Promise<void>;
  getDeckSize(): number;
  planeswalk(coordinates?: Coordinates): void;
}
