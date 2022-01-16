import { WallStates } from '../wall';

export interface ExportedCard {
  id: string;
  counters?: number;
}

export interface CardInterface {
  id: string;
  oracleId: string;
  multiverseIds: Array<number>;
  name: string;
  scryfallUri: string;
  typeLine: string;
  oracleText: string;
  gathererUri: string;

  type: string;

  chaos(walls: WallStates, initiator?: string): void;
  enter(walls: WallStates, initiator?: string): void;
  leave(): void;
  export(): ExportedCard;
}
