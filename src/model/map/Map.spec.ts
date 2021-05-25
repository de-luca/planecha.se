import { Container } from 'typedi';
import { DeckProvider } from '../../services/DeckProvider';
import { Map } from '.';
import { Card, Plane } from '../card';
import { MapType } from './MapInterface';

class TestMap extends Map {
  public constructor() {
    super();

    this.deck = Container.get(DeckProvider).getDeck();
    this._played = [];
    this._active = [];
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
    const map = new TestMap();

    expect(map['draw']()).toBeInstanceOf(Card);
    expect(map['deck']).toHaveLength(85);
  });

  it('reshuffle and draws a card', () => {
    const map = new TestMap();
    // eslint-disable-next-line prefer-destructuring
    const deck = map['deck'];
    map['_played'] = deck;
    map['deck'] = [];

    expect(map['draw']()).toBeInstanceOf(Card);
    expect(map['deck']).toHaveLength(85);
  });
});

describe('Map.revealUntil', () => {
  it('reveals a given number of requested card', () => {
    const map = new TestMap();
    const cards = map['revealUntil'](2, Plane);

    expect(cards.cards).toHaveLength(2);
    expect(cards.revealed.length).toBeGreaterThanOrEqual(2);
    for (const card of cards.cards) {
      expect(card).toBeInstanceOf(Plane);
    }
  });
});

describe('Map.putOnTop', () => {
  it('puts given cards on top of the deck', () => {
    const map = new TestMap();
    // pick a card from the deck
    const card = map['deck'][1];

    map['putOnTop']([card]);
    expect(map['deck']).toHaveLength(87);
    expect(map['deck'][0]).toEqual(card);
  });
});

describe('Map.putOnTheBottom', () => {
  it('puts given cards on the bottom of the deck', () => {
    const map = new TestMap();
    // pick a card from the deck
    const card = map['deck'][1];

    map['putOnTheBottom']([card]);
    expect(map['deck']).toHaveLength(87);
    expect(map['deck'][map['deck'].length - 1]).toEqual(card);
  });
});
