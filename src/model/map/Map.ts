import _shuffle from 'lodash.shuffle';
import { Card } from '../card';

export abstract class Map {
    protected deck: Array<Card>;

    protected played: Array<Card>;

    protected active: Array<Card>;

    protected globalState?: string;

    protected constructor() {
      this.deck = [];
      this.played = [];
      this.active = [];
      this.globalState = undefined;
    }

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
}
