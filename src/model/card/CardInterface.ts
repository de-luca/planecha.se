import type { WallStates } from '../wall';

export interface ExportedCard {
  id: string;
  counters?: number;
}

export interface CardInterface {
  id: string;
  name: string;
  typeLine: string;
  oracleText: string;

  chaos(walls: WallStates, initiator: string): void;
  enter(walls: WallStates, initiator: string): void;
  leave(): void;
  export(): ExportedCard;
}
