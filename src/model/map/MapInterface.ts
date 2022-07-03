import { ExportedWallStates, WallStates } from '../wall';
import { Card, ExportedCard, Plane } from '../card';
import { DeckState } from '../deck/Deck';
import { ExportedTile, Tile } from './Tile';
import { Delta } from '@n1ru4l/json-patch-plus';

export enum EncounterTrigger {
  ON_PLANESWALK = 'ON_PLANESWALK',
  ON_HELLRIDE = 'ON_HELLRIDE',
}

export enum EncounterMechanic {
  MANUAL = 'MANUAL',
  AUTO = 'AUTO',
}

export interface TriggerConfig {
  enabled: boolean;
  mechanic: EncounterMechanic;
  ratio: number;
}

export type EncounterTriggers = Record<EncounterTrigger, TriggerConfig>;

export enum MapType {
  EMPTY = 'empty',
  CLASSIC = 'classic',
  ETERNITIES = 'eternities',
}

export enum EternitiesMapSubType {
  SINGLE_DECK = 'SINGLE_DECK',
  DUAL_DECK = 'DUAL_DECK',
}

export enum EternitiesMapDeckType {
  PLANES = 'PLANES',
  ALL = 'ALL',
}

export interface MapSpecs {
  type: MapType;
}

export interface EternitiesMapSpecs extends MapSpecs {
  subType: EternitiesMapSubType;
  deckType: EternitiesMapDeckType;
}

export interface Exported {
  specs: MapSpecs;
  wallStates: ExportedWallStates;
  hasStarted: boolean;
  deck: DeckState;
  active: Array<ExportedCard>;
  revealed?: { relevant: Array<string>, others: Array<string> };
  tiles?: Array<ExportedTile>;
  destination?: Coordinates;
}

export interface Revealed {
  relevant: Array<Card>;
  others: Array<Card>;
}

export interface Patch {
  playHead: number;
  event: string;
  delta?: Delta;
}

export interface Initable {
  initiator: string;
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

export type ChaosInput = Initable;
export type PlaneswalkInput =
  ClassicPlaneswalkInput |
  CustomClassicPlaneswalkInput |
  EternitiesPlaneswalkInput |
  CustomEternitiesPlaneswalkInput;
export type ResolveInput = Initable;

export interface MapInterface {
  walls: WallStates;
  hasStarted: boolean;
  specs: MapSpecs;
  active: Array<Card>;
  played: Array<Card>;
  remaining: number;
  revealed?: Revealed;
  ready: Promise<void>;

  // TODO: REMOVE FROM INTERFACE
  tiles: Array<Tile>;
  destination?: Coordinates;
  encounterTriggers: EncounterTriggers

  revealUntil(input: RevealUntilInput): void;
  resolveReveal(input: ResolveRevealInput): void;
  chaos(input: ChaosInput): void;
  planeswalk(input: PlaneswalkInput): void;
  resolve(input: ResolveInput): void;
  updateCounter(input: UpdateCounterInput): void;
  export(): Exported;
  apply(patch: Patch): void;
}
