import { ExportedWallStates, WallStates } from '../wall';
import { Card, ExportedCard, Plane } from '../card';
import { DeckState } from '../deck/Deck';
import { Patch } from '#/utils/delta';

export enum MapType {
  SINGLE = 'single',
  MULTI = 'multi',
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

export type SinglePlaneswalkInput = Initable

export interface CustomSinglePlaneswalkInput extends SinglePlaneswalkInput {
  planes: Array<Plane>;
}

export interface EternitiesPlaneswalkInput extends Initable {
  coords: Coordinates;
}

export interface CustomEternitiesPlaneswalkInput extends EternitiesPlaneswalkInput {
  planes: Array<Plane>;
}

export interface AddActivePlaneInput extends Initable {
  plane: Plane;
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
  stop?: boolean;
}

export type PlaneswalkInput =
  SinglePlaneswalkInput |
  CustomSinglePlaneswalkInput |
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
  addActivePlane(input: AddActivePlaneInput): void;
  resolve(input: ResolveInput): void;
  updateCounter(input: UpdateCounterInput): void;
  export(): Exported;
  dump(): Exported;
  apply(patch: Patch, peerId: string): void;
  restore(state: Exported): void;
}
