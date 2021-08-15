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

  chaos(passivity?: Passivity): void;
  enter(passivity?: Passivity): void;
  leave(): void;
}
