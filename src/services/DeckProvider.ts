import { Container, Service } from 'typedi';
import _shuffle from 'lodash.shuffle';
import {
  CardFactory,
  Card,
  Props,
  Plane,
} from '../model/card';
import { Deck } from '@/model/deck/Deck';

import cards from '../assets/cards.json';

@Service()
export class DeckProvider {
  private cards: Array<Card>;

  public constructor() {
    const factory = Container.get(CardFactory);
    this.cards = (cards as Array<Props>).map((c) => factory.build(c));
  }

  public getAllCards(): Array<Card> {
    return this.cards;
  }

  public getCard<T extends Card>(id: string): T {
    return this.cards.find(c => c.id === id) as T;
  }

  public getOrderedPile<T extends Card>(cards: Array<string>): Array<T> {
    return cards.map(id => this.getCard<T>(id));
  }

  public getDeck(): Deck<Card> {
    return new Deck<Card>(this.buildShuffledPile());
  }

  public getPlaneDeck(): Deck<Plane> {
    return new Deck<Plane>(
      this.buildShuffledPile()
        .filter((c) => c instanceof Plane) as Array<Plane>,
    );
  }

  public getSpecificDeck(cards: Array<string>): Deck<Card> {
    return new Deck<Card>(
      _shuffle(this.getOrderedPile<Card>([...cards]))
    );
  }

  public getOrderedDeck<T extends Card>(cards: Array<string>): Deck<T> {
    return new Deck<T>(this.getOrderedPile(cards));
  }

  private buildShuffledPile(): Array<Card> {
    return _shuffle(this.cards);
  }
}
