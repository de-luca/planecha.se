import { Card, Plane } from '../card';
import { DeckState } from '../deck/Deck';

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

  chaos(passive?: boolean, mateId?: string): void;

  planeswalk(coordinates?: Coordinates, passive?: boolean, mateId?: string): boolean;
  customPlaneswalk(planes: Array<Plane>, coordinates?: Coordinates): void;

  planeswalkFromPhenomenon(passive?: boolean, mateId?: string): boolean;
  encounter(coordinates: Coordinates, passive?: boolean, mateId?: string): boolean;

  updateCounter(id: string, change: number): void;

  export(): Exported;
  applyShuffle(state: Exported): void;
}
