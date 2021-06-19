import { Card, Plane } from "../card";

export interface Coordinates {
  x: number;
  y: number;
}

export enum MapType {
  EMPTY = 'empty',
  CLASSIC = 'classic',
  ETERNITIES = 'eternities',
}

export interface Exported {
  type: MapType;
  deck: Array<string>;
  played: Array<string>;
  active: Array<string>;
  revealed?: { relevant: Array<string>, others: Array<string> };
}

export interface Revealed { 
  relevant: Array<Card>; 
  others: Array<Card>;
}

export interface MapInterface {
  type: MapType;
  active: Array<Card>;
  played: Array<Card>;
  revealed?: Revealed;
  ready: Promise<void>;

  getDeckSize(): number;

  revealUntil(count: number, type?: typeof Card): boolean;
  resolveReveal(top: Array<Card>, bottom: Array<Card>): void;
  
  putOnTop(cards: Array<Card>): void;
  putOnTheBottom(cards: Array<Card>): void;
  clearRevealed(): void;

  chaos(passive?: boolean, mateId?: string): void;
  planeswalk(coordinates?: Coordinates, passive?: boolean, mateId?: string): boolean;
  customPlaneswalk(
    planes: Array<Plane>, 
    coordinates?: Coordinates, 
  ): void;
  updateCounter(id: string, change: number): void;

  export(): Exported;
  applyShuffle(state: Exported): void; 
}
