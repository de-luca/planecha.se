import { ExportedMapState, MapStates } from '../states';
import { Card, ExportedCard, Plane } from '../card';
import { DeckState } from '../deck/Deck';
import { ExportedTile, Tile } from './Tile';

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
  states: ExportedMapState;
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

export interface MapInterface {
  states: MapStates;
  hasStarted: boolean;

  specs: MapSpecs;
  active: Array<Card>;
  played: Array<Card>;
  remaining: number;

  revealed?: Revealed;
  ready: Promise<void>;

  tiles: Array<Tile>;
  destination?: Coordinates;
  encounterTriggers: EncounterTriggers

  revealUntil(count: number, type?: typeof Card): boolean;
  resolveReveal(top: Array<Card>, bottom: Array<Card>): void;

  chaos(passivity?: Passivity): void;

  planeswalk(coords?: Coordinates, passivity?: Passivity): boolean;
  customPlaneswalk(planes: Array<Plane>, coords?: Coordinates): void;

  resolve(passivity?: Passivity): boolean;
  encounter(coords: Coordinates, passivity?: Passivity): boolean;

  updateCounter(planeId: string, change: number): void;

  export(): Exported;
  applyUndo(state: Exported): void;
  applyShuffle(state: Exported): void;
}
