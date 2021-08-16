import { MapState } from "../state/MapState";

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

  chaos(state: MapState, passivity?: Passivity): void;
  enter(state: MapState, passivity?: Passivity): void;
  leave(): void;
}
