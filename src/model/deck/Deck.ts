import { shuffle as _shuffle } from '@/services/shuffle';
import { Card, ExportedCard, Plane } from '../card';

export interface DeckState {
  cards: Array<ExportedCard>;
  played: Array<ExportedCard>;
}

export class Deck<T extends Card> {
  private _cards: Array<T>;
  private _played: Array<T>;

  public constructor(cards: Array<T>, played?: Array<T>) {
    this._cards = cards;
    this._played = played ?? [];
  }

  public get remaining(): number {
    return this._cards.length;
  }

  public get played(): Array<T> {
    return this._played;
  }

  public draw(): T {
    const card = this._cards.shift();
    if (!card) {
      this.shuffle();
      return this._cards.shift() as T;
    }
    return card as T;
  }

  public setPlayed(...cards: Array<T>): void {
    this._played.push(...cards);
  }

  public drawPlane(): Plane {
    let card: Card;
    let found = false;

    do {
      // Draw card
      card = this.draw();
      if (card instanceof Plane) {
        found = true;
      } else {
        this._cards.push(card as T);
      }
    } while (!found);

    return card as Plane;
  }

  public shuffle(): void {
    this._cards = _shuffle([...this._cards, ...this._played]);
    this._played = [];
  }

  public revealUntil(
    count: number = 1,
    type: typeof Card = Card,
  ): {
    relevant: Array<Card>;
    others: Array<Card>;
  } {
    const relevant: Array<Card> = [];
    const others: Array<Card> = [];
    let found = 0;

    do {
      const drawn = this.draw();
      if (drawn instanceof type) {
        found++;
        relevant.push(drawn);
      } else {
        others.push(drawn);
      }
    } while (found < count);

    return { relevant, others };
  }

  public putOnTop(cards: Array<T>): void {
    this._cards.unshift(...cards);
  }

  public putOnTheBottom(cards: Array<T>): void {
    this._cards.push(...cards);
  }

  public export(): DeckState {
    return {
      cards: this._cards.map(c => c.export()),
      played: this._played.map(c => c.export()),
    };
  }
}
