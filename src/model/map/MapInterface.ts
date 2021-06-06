import { Log } from "@/store/states/map";
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

export interface Exported {
  type: MapType;
  deck: Array<string>;
  played: Array<string>;
  active: Array<string>;
}

export interface Revealed { 
  cards: Array<Card>; 
  revealed: Array<Card>;
}

export interface MapInterface {
  type: MapType;
  active: Array<Card>;
  played: Array<Card>;
  revealed?: Revealed;
  ready: Promise<void>;

  getDeckSize(): number;

  revealUntil(count: number, type?: typeof Card): void;
  resolveReveal(top: Array<Card>, bottom: Array<Card>): void;
  
  putOnTop(cards: Array<Card>): void;
  putOnTheBottom(cards: Array<Card>): void;
  clearRevealed(): void;

  chaos(): void;
  planeswalk(coordinates?: Coordinates): void;
  updateCounter(id: string, change: number): void;

  export(): Exported;
  
  getPlaneswalkLog(): Omit<Log, 'initiator'>;
  getCounterLog(id: string, change: number): Omit<Log, 'initiator'>;
}
