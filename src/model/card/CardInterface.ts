import { State } from "../state/State";

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

  chaos(state: State, passivity?: Passivity): void;
  enter(state: State, passivity?: Passivity): void;
  leave(): void;
}
