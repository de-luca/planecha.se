import { Card, Plane } from '../card';
import { DeckState } from '../deck/Deck';
import { ExportedMapState, MapState } from '../state/MapState';

export interface Coordinates {
  x: number;
  y: number;
}

export enum TileStatus {
  ACTIVE = 'active',
  VISIBLE = 'visible',
}

export interface Tile {
  coordinates: Coordinates;
  state: TileStatus;
  plane: Array<Plane>;
}

export interface ExportedTile {
  coordinates: Coordinates;
  state: TileStatus;
  plane: Array<string>;
}

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
  state: ExportedMapState;
  deck: DeckState;
  active: Array<string>;
  revealed?: { relevant: Array<string>, others: Array<string> };
  tiles?: Array<ExportedTile>;
  hasStarted?: boolean;
}

export interface Revealed {
  relevant: Array<Card>;
  others: Array<Card>;
}

export interface MapInterface {
  state: MapState;

  specs: MapSpecs;
  active: Array<Card>;
  played: Array<Card>;
  remaining: number;

  revealed?: Revealed;
  ready: Promise<void>;

  tiles: Array<Tile>;
  hasStarted: boolean;
  destination?: Coordinates;
  encounterTriggers: EncounterTriggers

  revealUntil(count: number, type?: typeof Card): boolean;
  resolveReveal(top: Array<Card>, bottom: Array<Card>): void;
  clearRevealed(): void;

  chaos(passivity?: Passivity): void;

  planeswalk(coordinates?: Coordinates, passivity?: Passivity): boolean;
  customPlaneswalk(planes: Array<Plane>, coordinates?: Coordinates): void;

  planeswalkFromPhenomenon(passivity?: Passivity): boolean;
  encounter(coordinates: Coordinates, passivity?: Passivity): boolean;

  updateCounter(id: string, change: number): void;

  export(): Exported;
  applyShuffle(state: Exported): void;
}
