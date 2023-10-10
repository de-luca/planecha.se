import { WallStates } from '../wall';
import { CardInterface, ExportedCard } from './CardInterface';

export type Type = 'Plane' | 'Phenomenon';

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
  sets: Array<string>;
  isUB: boolean;
  counter?: Counter;
}

export abstract class Card implements CardInterface {
  public readonly id: string;
  public readonly name: string;
  public readonly typeLine: string;
  public readonly oracleText: string;
  public readonly sets: Array<string>;
  public readonly isUB: boolean;

  public constructor(props: Props) {
    this.id = props.id;
    this.name = props.name;
    this.typeLine = props.typeLine;
    this.oracleText = props.oracleText;
    this.sets = props.sets;
    this.isUB = props.isUB;
  }

  public abstract get type(): Type;

  public abstract chaos(walls: WallStates, initiator: string): void;
  public abstract enter(walls: WallStates, initiator: string): void;
  public abstract leave(): void;

  public export(): ExportedCard {
    return { id: this.id };
  }
}
