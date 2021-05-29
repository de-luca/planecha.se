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
  planeswalk(coordinates?: Coordinates): void;
  export(): Exported;
  getLog(): Omit<Log, 'initiator'>;
}
