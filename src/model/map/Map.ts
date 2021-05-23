import _shuffle from 'lodash.shuffle';
import { resolve } from 'path';
import { Card } from '../card';
import { Coordinates, MapInterface, MapType } from './MapInterface';

export abstract class Map implements MapInterface {
    protected deck: Array<Card>;
    protected _played: Array<Card>;
    protected _active: Array<Card>;
    protected globalState?: string;

    protected constructor() {
      this.deck = [];
      this._played = [];
      this._active = [];
      this.globalState = undefined;
    }

    public abstract get type(): MapType;

    public get active(): Array<Card> {
      return this._active;
    }

    public get played(): Array<Card> {
      return this._played;
    }

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
        this._played = [];

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
