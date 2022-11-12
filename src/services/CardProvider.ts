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

export class CardProvider {
  private static raw: Map<string, Props> =
    (cards as Array<Props>).reduce((acc, p) => acc.set(p.id, p), new Map<string, Props>);

  public static getCard<T extends Card>(id: string): T {
    return CardFactory.build((this.raw.get(id) as Props)) as T;
  }

  public static getAllCards(): Array<Card> {
    return [...this.raw.values()].map(r => CardFactory.build(r));
  }

  public static getCardList<T extends Card>(list: Array<ListInput>): Array<T> {
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

  public static getPlaneCards(): Array<Plane> {
    return [...this.raw.values()]
      .filter(r => r.typeLine !== 'Phenomenon')
      .map(r => CardFactory.build(r) as Plane);
  }

  public static getPhenomenonCards(): Array<Phenomenon> {
    return [...this.raw.values()]
      .filter(r => r.typeLine === 'Phenomenon')
      .map(r => CardFactory.build(r) as Phenomenon);
  }

  public static getDeck(): Deck<Card> {
    return new Deck<Card>(shuffle(this.getAllCards()));
  }

  public static getPlaneDeck(): Deck<Plane> {
    return new Deck<Plane>(shuffle(this.getPlaneCards()));
  }

  public static getPhenomenonDeck(): Deck<Phenomenon> {
    return new Deck<Phenomenon>(shuffle(this.getPhenomenonCards()));
  }

  public static getCustomDeck(list: Array<ListInput>): Deck<Card> {
    return new Deck<Card>(shuffle(this.getCardList<Card>(list)));
  }

  public static restoreDeck<T extends Card>(state: DeckState): Deck<T> {
    return new Deck<T>(
      this.getCardList(state.cards),
      this.getCardList(state.played),
    );
  }
}
