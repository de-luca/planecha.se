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

  chaos(walls: WallStates, passivity?: Passivity): void;
  enter(walls: WallStates, passivity?: Passivity): void;
  leave(): void;
  export(): ExportedCard;
}
