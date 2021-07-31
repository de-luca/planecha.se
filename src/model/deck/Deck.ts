import _shuffle from 'lodash.shuffle';
import { Card, Plane } from "../card";

interface Revealed {
  relevant: Array<Card>;
  others: Array<Card>;
  shuffled: boolean;
}

export class Deck<T extends Card> {
  private cards: Array<T>;
  private playedCards: Array<T>;

  public constructor(cards: Array<T>, played?: Array<T>) {
    this.cards = cards;
    this.playedCards = played ?? [];
  }

  public get remaining(): number {
    return this.cards.length;
  }

  public get played(): Array<T> {
    return this.playedCards;
  }

  public draw(): { card: T, shuffled: boolean } {
    // Reach for the top card
    const card = this.cards.shift();

    // There's nothing, like the deep void in your heart
    if (!card) {
      this.shuffle();

      return {
        card: this.cards.shift() as T,
        shuffled: true,
      };
    }

    return { card: card as T, shuffled: false };
  }

  public play(...cards: Array<T>): void {
    this.playedCards.push(...cards);
  }

  public drawPlane(): { card: Plane, shuffled: boolean } {
    let card: Card;
    let shuffled: boolean;
    let found = false;

    do {
      // Draw card
      ({ card, shuffled } = this.draw());
      if (card instanceof Plane) {
        // it's a plane
        found = true;
      } else {
        // it's a phenomenon, put it in the bottom
        this.cards.push(card as T);
      }
    } while (!found);

    return { card: card as Plane, shuffled };
  }

  public shuffle(): void {
    this.cards = _shuffle(this.playedCards);
    this.playedCards = [];
  }

  public revealUntil(count = 1, type: typeof Card = Card): Revealed {
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

    return { relevant, others, shuffled };
  }

  public putOnTop(cards: Array<T>): void {
    this.cards.unshift(...cards);
  }

  public putOnTheBottom(cards: Array<T>): void {
    this.cards.push(...cards);
  }
}
