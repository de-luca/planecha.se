import { Delta } from '@n1ru4l/json-patch-plus';
import { ExportedWallStates, WallStates } from '../wall';
import { Card, ExportedCard, Plane } from '../card';
import { DeckState } from '../deck/Deck';
import { Patch } from '../ver/Patch';

export enum MapType {
  CLASSIC = 'classic',
  ETERNITIES = 'eternities',
}

export interface MapSpecs {
  type: MapType;
}

export interface Exported {
  specs: MapSpecs;
  wallStates: ExportedWallStates;
  hasStarted: boolean;
  deck: DeckState;
  active: Array<ExportedCard>;
  revealed?: { relevant: Array<string>, others: Array<string> };
}

export interface Revealed {
  relevant: Array<Card>;
  others: Array<Card>;
}

export interface Initable {
  initiator: string;
}

export interface ChaosInput extends Initable {
  card: Card;
}

export interface ClassicPlaneswalkInput extends Initable {}

export interface CustomClassicPlaneswalkInput extends ClassicPlaneswalkInput {
  planes: Array<Plane>;
}

export interface EternitiesPlaneswalkInput extends Initable {
  coords: Coordinates;
}

export interface CustomEternitiesPlaneswalkInput extends EternitiesPlaneswalkInput {
  planes: Array<Plane>;
}

export interface UpdateCounterInput {
  planeId: string;
  change: number;
}

export interface RevealUntilInput {
  count: number;
  type?: typeof Card;
}

export interface ResolveRevealInput {
  top: Array<Card>;
  bottom: Array<Card>;
}

export type PlaneswalkInput =
  ClassicPlaneswalkInput |
  CustomClassicPlaneswalkInput |
  EternitiesPlaneswalkInput |
  CustomEternitiesPlaneswalkInput;
export type ResolveInput = Initable;

export interface MapInterface {
  specs: MapSpecs;
  ready: Promise<void>;
  hasStarted: boolean;
  wallStates: WallStates;
  revealed?: Revealed;
  active: Array<Card>;
  remaining: number;
  played: Array<Card>;

  start(): void;
  revealUntil(input: RevealUntilInput): void;
  resolveReveal(input: ResolveRevealInput): void;
  chaos(input: ChaosInput): void;
  planeswalk(input: PlaneswalkInput): void;
  resolve(input: ResolveInput): void;
  updateCounter(input: UpdateCounterInput): void;
  export(): Exported;
  apply(patch: Patch): void;
  restore(state: Exported): void;
}
