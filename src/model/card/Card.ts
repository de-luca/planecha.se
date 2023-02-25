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
  name: string;
  typeLine: string;
  oracleText: string;
  counter?: Counter;
}

export abstract class Card implements CardInterface {
  public readonly id: string;
  public readonly name: string;
  public readonly typeLine: string;
  public readonly oracleText: string;

  public constructor(props: Props) {
    this.id = props.id;
    this.name = props.name;
    this.typeLine = props.typeLine;
    this.oracleText = props.oracleText;
  }

  public abstract chaos(walls: WallStates, initiator: string): void;
  public abstract enter(walls: WallStates, initiator: string): void;
  public abstract leave(): void;

  public export(): ExportedCard {
    return { id: this.id };
  }
}
