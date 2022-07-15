import { describe, it, expect } from 'vitest';
import { Container } from 'typedi';
import { Phenomenon, Plane } from '../model/card';
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
    expect(card.name).toEqual('Glimmervoid Basin');
  });
});

describe('DeckProvider.getOrderedPile', () => {
  it('returns an array with only requested cards in order', () => {
    const ids = [
      '56a1afab-782c-4f31-96f5-17b676852fea',
      '5d87893f-36e0-4621-a139-fedbc74ed4c5',
    ];
    const cards = provider.getOrderedPile(ids);
    expect(cards).toHaveLength(2);
    expect(cards[0].id).toEqual(ids[0]);
    expect(cards[1].id).toEqual(ids[1]);
  });
});

describe('DeckProvider.getPileWithState', () => {
  it('returns an array with only requested cards in order and state', () => {
    const state = [
      { id: '56a1afab-782c-4f31-96f5-17b676852fea' },
      { id: 'd6dc655e-d8ef-443a-bb3e-46c7ca1555ba', counters: 42 },
    ];
    const cards = provider.getPileWithState(state);
    expect(cards).toHaveLength(2);
    expect(cards[0].id).toEqual(state[0].id);
    expect(cards[1].id).toEqual(state[1].id);
    expect((cards[1] as Plane).counter?.value).toEqual(state[1].counters);
  });
});

describe('DeckProvider.getDeck', () => {
  it('returns a shuffled deck with all cards available', () => {
    expect(provider.getDeck().remaining).toEqual(86);
  });
});

describe('DeckProvider.getPlaneDeck', () => {
  it('returns a deck with only planes', () => {
    const planeDeck = provider.getPlaneDeck();
    expect(planeDeck.remaining).toEqual(78);
    while (planeDeck.remaining > 0) {
      expect(planeDeck.draw()).toBeInstanceOf(Plane);
    }
  });
});

describe('DeckProvider.getPhenomenonDeck', () => {
  it('returns a deck with only phenomena', () => {
    const planeDeck = provider.getPhenomenonDeck();
    expect(planeDeck.remaining).toEqual(8);
    while (planeDeck.remaining > 0) {
      expect(planeDeck.draw()).toBeInstanceOf(Phenomenon);
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
    expect(deck.remaining).toEqual(2);
    while (deck.remaining > 0) {
      expect(ids).toContain(deck.draw().id);
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
    expect(deck.remaining).toEqual(2);
    expect(deck.draw().id).toEqual(ids[0]);
    expect(deck.draw().id).toEqual(ids[1]);
  });
});

describe('DeckProvider.getDeckFromExport', () => {
  it('returns a Deck from a DeckState', () => {
    const deck = provider.getDeckFromExport({
      cards: [{ id: '56a1afab-782c-4f31-96f5-17b676852fea' }],
      played: [{ id: '5d87893f-36e0-4621-a139-fedbc74ed4c5' }],
    });
    expect(deck.remaining).toEqual(1);
    expect(deck.played).toHaveLength(1);
    expect(deck.played[0].id).toEqual('5d87893f-36e0-4621-a139-fedbc74ed4c5');
    expect(deck.draw().id).toEqual('56a1afab-782c-4f31-96f5-17b676852fea');
  });
});

