import { MapStates } from "../states";

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

  chaos(state: MapStates, passivity?: Passivity): void;
  enter(state: MapStates, passivity?: Passivity): void;
  leave(): void;
}
