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

export interface MapInterface {
  type: MapType;
  active: Array<Card>;
  played: Array<Card>;
  ready: Promise<void>;

  getDeckSize(): number;

  chaos(): void;
  planeswalk(coordinates?: Coordinates): void;
  updateCounter(id: string, change: number): void;

  export(): Exported;
  
  getPlaneswalkLog(): Omit<Log, 'initiator'>;
  getCounterLog(id: string, change: number): Omit<Log, 'initiator'>;
}
