import { WallStates } from '../wall';
import { CardInterface, ExportedCard } from './CardInterface';

export interface Counter {
  name: string;
  value: number;
  start: number;
  max: number | null;
  reset: boolean;
}

export interface Props {
  id: string;
  oracleId: string;
  multiverseIds: Array<number>;
  name: string;
  scryfallUri: string;
  typeLine: string;
  oracleText: string;
  gathererUri: string;
  counter?: Counter;
}

export abstract class Card implements CardInterface {
  public readonly id: string;
  public readonly oracleId: string;
  public readonly multiverseIds: Array<number>;
  public readonly name: string;
  public readonly scryfallUri: string;
  public readonly typeLine: string;
  public readonly oracleText: string;
  public readonly gathererUri: string;

  public constructor(props: Props) {
    this.id = props.id;
    this.oracleId = props.oracleId;
    this.multiverseIds = props.multiverseIds;
    this.name = props.name;
    this.scryfallUri = props.scryfallUri;
    this.typeLine = props.typeLine;
    this.oracleText = props.oracleText;
    this.gathererUri = props.gathererUri;
  }

  public abstract chaos(walls: WallStates, initiator: string): void;
  public abstract enter(walls: WallStates, initiator: string): void;
  public abstract leave(): void;

  public export(): ExportedCard {
    return { id: this.id };
  }
}
