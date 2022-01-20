import { Card, Plane } from '../card';
import { Exported } from '../map';
import { WallState, StateKey, StateOp } from '../wall';

export interface Join {
  roomId: string;
  name: string;
}

export interface Planeswalk {
  coords?: Coordinates;
}
export interface CustomPlaneswalk {
  planes: Array<Plane>;
}

export interface Encounter {
  coords: Coordinates;
}

export interface Counters {
  planeId: string;
  change: number;
}

export interface UpdateWallState {
  key: StateKey;
  op: StateOp;
  val?: WallState;
}

export interface Reveal {
  count: number;
  type?: typeof Card;
}
export interface ResolveReveal {
  top: Array<Card>;
  bottom: Array<Card>;
}

export interface Undo {
  version: Exported;
}

export interface CustomPlaneswalkWire {
  planes: Array<string>;
}
export interface RevealWire {
  count: number;
  type?: string;
}
export interface ResolveRevealWire {
  top: Array<string>;
  bottom: Array<string>;
}
export interface NameWire {
  name: string;
}
