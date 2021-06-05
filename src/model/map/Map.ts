import { Log, LogType } from '@/store/states/map';
import _shuffle from 'lodash.shuffle';
import { Card, Phenomenon } from '../card';
import { Coordinates, Exported, MapInterface, MapType } from './MapInterface';

export interface Props {
  deck: Array<Card>;
  played?: Array<Card>;
  active?: Array<Card>;
}

export abstract class Map implements MapInterface {
  public deck: Array<Card>;
  public played: Array<Card>;
  public active: Array<Card>;
  public globalState?: string;

  public constructor(props: Props) {
    this.deck = props.deck;
    this.played = props.played ?? [];
    this.active = props.active ?? [];
    this.globalState = undefined;
  }

  public abstract get type(): MapType;

  public get ready(): Promise<void> {
    return new Promise(resolve => resolve());
  }

  public getDeckSize(): number {
    return this.deck.length;
  }

  public abstract planeswalk(coordinates?: Coordinates): void;

  protected draw<T extends Card>(): T {
    // Reach for the top card
    const card = this.deck.shift();

    // There's nothing, like the deep void in your heart
    if (!card) {
      // Shuffle the pile of card
      this.deck = _shuffle(this.played);
      this.played = [];

      return this.deck.shift() as T;
    }

    return card as T;
  }

  protected revealUntil<T extends Card>(
    count = 1,
    type: typeof Card = Card,
  ): { cards: Array<T>; revealed: Array<Card> } {
    const revealed: Array<Card> = [];
    const cards: Array<T> = [];
    let found = 0;

    do {
      const card = this.draw();
      if (card instanceof type) {
        found++;
        cards.push(card as T);
      }
      revealed.push(card);
    } while (found < count);

    return { cards, revealed };
  }

  protected putOnTop(cards: Array<Card>): void {
    this.deck.unshift(...cards);
  }

  protected putOnTheBottom(cards: Array<Card>): void {
    this.deck.push(..._shuffle(cards));
  }

  public export(): Exported {
    return {
      type: this.type,
      deck: this.deck.reduce<Array<string>>((acc, card) => {
        acc.push(card.id);
        return acc;
      }, []),
      played: this.played.reduce<Array<string>>((acc, card) => {
        acc.push(card.id);
        return acc;
      }, []),
      active: this.active.reduce<Array<string>>((acc, card) => {
        acc.push(card.id);
        return acc;
      }, []),
    };
  }

  public getLog(): Omit<Log, 'initiator'> {
    return {
      type: this.active[0] instanceof Phenomenon
        ? LogType.ENCOUNTER
        : LogType.PLANESWALK,
      outcome: this.active.map(c => c.name),
    };
  }
}
