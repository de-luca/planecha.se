import { Inject, Service } from 'typedi';
import {
  CardFactory,
  Card,
  Props,
  Plane,
  Phenomenon,
  ExportedCard,
} from '../model/card';
import cards from '../assets/cards.json';
import { shuffle } from './shuffle';
import { Deck, DeckState } from '@/model/deck/Deck';

type ListInput = ExportedCard | string;

@Service()
export class CardProvider {
  @Inject(() => CardFactory)
  private factory: CardFactory;
  private raw: Map<string, Props>;

  public constructor() {
    this.raw = (cards as Array<Props>).reduce((acc, p) => acc.set(p.id, p), new Map<string, Props>);
  }

  public getCard<T extends Card>(id: string): T {
    return this.factory.build((this.raw.get(id) as Props)) as T;
  }

  public getAllCards(): Array<Card> {
    return [...this.raw.values()].map(r => this.factory.build(r));
  }

  public getCardList<T extends Card>(list: Array<ListInput>): Array<T> {
    return list.map(item => {
      if (typeof item === 'string') {
        return this.getCard<T>(item);
      }

      const card = this.getCard<T>(item.id);
      if (item.counters && card instanceof Plane && card.counter) {
        card.counter.value = item.counters;
      }

      return card;
    });
  }

  public getPlaneCards(): Array<Plane> {
    return [...this.raw.values()]
      .filter(r => r.typeLine !== 'Phenomenon')
      .map(r => this.factory.build(r) as Plane);
  }

  public getPhenomenonCards(): Array<Phenomenon> {
    return [...this.raw.values()]
      .filter(r => r.typeLine === 'Phenomenon')
      .map(r => this.factory.build(r) as Phenomenon);
  }

  public getDeck(): Deck<Card> {
    return new Deck<Card>(shuffle(this.getAllCards()));
  }

  public getPlaneDeck(): Deck<Plane> {
    return new Deck<Plane>(shuffle(this.getPlaneCards()));
  }

  public getPhenomenonDeck(): Deck<Phenomenon> {
    return new Deck<Phenomenon>(shuffle(this.getPhenomenonCards()));
  }

  public getCustomDeck(list: Array<ListInput>): Deck<Card> {
    return new Deck<Card>(shuffle(this.getCardList<Card>(list)));
  }

  public restoreDeck<T extends Card>(state: DeckState): Deck<T> {
    return new Deck<T>(
      this.getCardList(state.cards),
      this.getCardList(state.played),
    );
  }
}
