import { Container, Service } from 'typedi';
import {
  CardFactory,
  Card,
  Props,
  Plane,
  Phenomenon,
  ExportedCard,
} from '../model/card';
import { Deck, DeckState } from '@/model/deck/Deck';
import { shuffle } from './shuffle';

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

  public getPileWithState<T extends Card>(cards: Array<ExportedCard>): Array<T> {
    return cards.map(state => {
      const card = this.getCard<T>(state.id);
      if (state.counters && card instanceof Plane && card.counter) {
        card.counter.value = state.counters;
      }

      return card;
    });
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

  public getPhenomenonDeck(): Deck<Phenomenon> {
    return new Deck<Phenomenon>(
      this.buildShuffledPile()
        .filter((c) => c instanceof Phenomenon) as Array<Phenomenon>,
    );
  }

  public getSpecificDeck(cards: Array<string>): Deck<Card> {
    return new Deck<Card>(
      shuffle(this.getOrderedPile<Card>([...cards])),
    );
  }

  public getOrderedDeck<T extends Card>(cards: Array<string>): Deck<T> {
    return new Deck<T>(this.getOrderedPile(cards));
  }

  public getDeckFromExport<T extends Card>(state: DeckState): Deck<T> {
    return new Deck<T>(
      this.getOrderedPile(state.cards),
      this.getOrderedPile(state.played),
    );
  }

  private buildShuffledPile(): Array<Card> {
    return shuffle(this.cards);
  }
}
