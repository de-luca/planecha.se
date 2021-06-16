import { DeckProvider } from '@/services/DeckProvider';
import { Log, LogType } from '@/store/states/map';
import _shuffle from 'lodash.shuffle';
import Container from 'typedi';
import { Card, Counter, Phenomenon, Plane } from '../card';
import { Coordinates, Exported, MapInterface, MapType, Revealed } from './MapInterface';

export interface Props {
  deck: Array<Card>;
  played?: Array<Card>;
  active?: Array<Card>;
}

export abstract class Map implements MapInterface {
  public deck: Array<Card>;
  public played: Array<Card>;
  public active: Array<Card>;
  public revealed?: Revealed;
  public globalState?: string;

  public constructor(props: Props) {
    this.deck = props.deck;
    this.played = props.played ?? [];
    this.active = props.active ?? [];
    this.revealed = undefined;
    this.globalState = undefined;
  }
  
  public abstract get type(): MapType;

  public get ready(): Promise<void> {
    return new Promise(resolve => resolve());
  }

  public getDeckSize(): number {
    return this.deck.length;
  }

  public chaos(passive: boolean = false): void {
    this.active.forEach(c => c.chaos(passive));
  }

  public abstract planeswalk(coordinates?: Coordinates, passive?: boolean): boolean;
  public abstract customPlaneswalk(
    planes: Array<Plane>, 
    coordinates?: Coordinates,
    passive?: boolean, 
  ): void;

  public updateCounter(id: string, change: number): void {
    (this.active.find(c => c.id === id) as Plane).updateCounter(change);
  }

  protected draw<T extends Card>(): { card: T, shuffled: boolean } {
    // Reach for the top card
    const card = this.deck.shift();

    // There's nothing, like the deep void in your heart
    if (!card) {
      this.shuffleDeck();

      return {
        card: this.deck.shift() as T,
        shuffled: true,
      };
    }

    return { card: card as T, shuffled: false };
  }

  protected shuffleDeck(): void {
    console.log('SHUFFLED');
    this.deck = _shuffle(this.played);
    this.played = [];
  }

  public revealUntil(count = 1, type: typeof Card = Card): boolean {
    const relevant: Array<Card> = [];
    const others: Array<Card> = [];
    let shuffled = false;
    let found = 0;

    do {
      const drawn = this.draw();
      shuffled = drawn.shuffled;

      if (drawn.card instanceof type) {
        found++;
        relevant.push(drawn.card);
      } else {
        others.push(drawn.card);
      }
    } while (found < count);

    this.revealed = { relevant, others };

    return shuffled;
  }

  public resolveReveal(top: Card[], bottom: Card[]): void {
    this.putOnTop(top);
    this.putOnTheBottom(bottom);
    this.clearRevealed();
  }

  public putOnTop(cards: Array<Card>): void {
    this.deck.unshift(...cards);
  }

  public putOnTheBottom(cards: Array<Card>): void {
    this.deck.push(...cards);
  }

  public clearRevealed(): void {
    this.revealed = undefined;
  }

  public export(): Exported {
    return {
      type: this.type,
      deck: this.deck.map(c => c.id),
      played: this.played.map(c => c.id),
      active: this.active.map(c => c.id),
      revealed: this.revealed === undefined
        ? undefined
        : {
          relevant: this.revealed.relevant.map(c => c.id),
          others: this.revealed.others.map(c => c.id),
        },
    };
  }

  public applyShuffle(state: Exported): void {
    this.played = [];
    this.deck = Container.get(DeckProvider).getOrderedDeck(state.deck);
    this.active = Container.get(DeckProvider).getOrderedDeck(state.active);
    this.revealed = state.revealed === undefined
      ? undefined
      : {
        relevant: Container.get(DeckProvider).getOrderedDeck(state.revealed.relevant),
        others: Container.get(DeckProvider).getOrderedDeck(state.revealed.others),
      };
  }

  public getPlaneswalkLog(): Omit<Log, 'initiator'> {
    return {
      type: this.active[0] instanceof Phenomenon
        ? LogType.ENCOUNTER
        : LogType.PLANESWALK,
      outcome: this.active.map(c => c.name),
    };
  }

  public getCounterLog(id: string, change: number): Omit<Log, 'initiator'> {
    const counter = (this.active.find(c => c.id === id) as Plane).counter as Counter;

    return {
      type: LogType.COUNTERS,
      outcome: [
        (change > 0 ? 'added' : 'removed') +
        ` ${Math.abs(change)} ${counter.name} counter (${counter.value})`,
      ],
    };
  }
}
