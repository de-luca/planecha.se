import { Container } from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { Map } from '.';
import { Card, Plane } from '../card';
import { MapType } from './MapInterface';
import { Props } from './Map';

class TestMap extends Map {
  public constructor(props: Props) {
    super(props);
  }
  public get type(): MapType {
    throw new Error('Method not implemented.');
  }
  public planeswalk(): void {
    throw new Error('Method not implemented.');
  }
}

describe('Map.draw', () => {
  it('draws a card', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });

    expect(map['draw']()).toBeInstanceOf(Card);
    expect(map['deck']).toHaveLength(85);
  });

  it('reshuffle and draws a card', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });
    // eslint-disable-next-line prefer-destructuring
    const deck = map['deck'];
    map['played'] = deck;
    map['deck'] = [];

    expect(map['draw']()).toBeInstanceOf(Card);
    expect(map['deck']).toHaveLength(85);
  });
});

describe('Map.revealUntil', () => {
  it('reveals a given number of requested Plane', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });
    const cards = map['revealUntil'](2, Plane);

    expect(cards.cards).toHaveLength(2);
    expect(cards.revealed.length).toBeGreaterThanOrEqual(2);
    for (const card of cards.cards) {
      expect(card).toBeInstanceOf(Plane);
    }
  });

  it('reveals a given number of requested Card', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });
    const cards = map['revealUntil'](2);

    expect(cards.cards).toHaveLength(2);
    expect(cards.revealed.length).toBeGreaterThanOrEqual(2);
    for (const card of cards.cards) {
      expect(card).toBeInstanceOf(Card);
    }
  });
});

describe('Map.putOnTop', () => {
  it('puts given cards on top of the deck', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });
    // pick a card from the deck
    const card = map['deck'][1];

    map['putOnTop']([card]);
    expect(map['deck']).toHaveLength(87);
    expect(map['deck'][0]).toEqual(card);
  });
});

describe('Map.putOnTheBottom', () => {
  it('puts given cards on the bottom of the deck', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });
    // pick a card from the deck
    const card = map['deck'][1];

    map['putOnTheBottom']([card]);
    expect(map['deck']).toHaveLength(87);
    expect(map['deck'][map['deck'].length - 1]).toEqual(card);
  });
});
