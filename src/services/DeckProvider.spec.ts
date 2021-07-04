import { Container } from 'typedi';
import { Plane } from '../model/card';
import { DeckProvider } from './DeckProvider';

const provider = Container.get(DeckProvider);

describe('DeckProvider.getAllCards', () => {
  it('returns all the cards', () => {
    expect(provider.getAllCards()).toHaveLength(86);
  });
});

describe('DeckProvider.getCard', () => {
  it('returns the requested card', () => {
    const card = provider.getCard('56a1afab-782c-4f31-96f5-17b676852fea');
    expect(card.name).toEqual('Glimmervoid Bassin');
  });
});

describe('DeckProvider.getDeck', () => {
  it('returns a shuffled deck with all cards available', () => {
    expect(provider.getDeck()).toHaveLength(86);
  });
});

describe('DeckProvider.getPlaneDeck', () => {
  it('returns a deck with only planes', () => {
    const planeDeck = provider.getPlaneDeck();
    expect(planeDeck).toHaveLength(78);
    for (const card of planeDeck) {
      expect(card).toBeInstanceOf(Plane);
    }
  });
});

describe('DeckProvider.getSpecificDeck', () => {
  it('returns a deck with only requested cards', () => {
    const ids = [
      '56a1afab-782c-4f31-96f5-17b676852fea',
      '5d87893f-36e0-4621-a139-fedbc74ed4c5',
    ];
    const deck = provider.getSpecificDeck(ids);
    expect(deck).toHaveLength(2);
    for (const card of deck) {
      expect(ids.includes(card.id)).toEqual(true);
    }
  });
});

describe('DeckProvider.getOrderedDeck', () => {
  it('returns a deck with only requested cards in order', () => {
    const ids = [
      '56a1afab-782c-4f31-96f5-17b676852fea',
      '5d87893f-36e0-4621-a139-fedbc74ed4c5',
    ];
    const deck = provider.getOrderedDeck(ids);
    expect(deck).toHaveLength(2);
    expect(deck[0].id).toEqual(ids[0]);
    expect(deck[1].id).toEqual(ids[1]);
  });
});


