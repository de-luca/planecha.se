import { describe, it, expect } from 'vitest';
import { Container } from 'typedi';
import { Phenomenon, Plane } from '../model/card';
import { CardProvider } from './CardProvider';

const provider = Container.get(CardProvider);

describe('CardProvider.getCard', () => {
  it('returns a single card', () => {
    const card = provider.getCard('56a1afab-782c-4f31-96f5-17b676852fea');
    expect(card.name).toEqual('Glimmervoid Basin');
  });
});

describe('CardProvider.getAllCards', () => {
  it('returns all the cards', () => {
    expect(provider.getAllCards()).toHaveLength(86);
  });
});

describe('CardProvider.getCardList', () => {
  it('returns only requested cards in order (Array<string>)', () => {
    const ids = [
      '56a1afab-782c-4f31-96f5-17b676852fea',
      '5d87893f-36e0-4621-a139-fedbc74ed4c5',
    ];
    const cards = provider.getCardList(ids);
    expect(cards).toHaveLength(2);
    expect(cards[0].id).toEqual(ids[0]);
    expect(cards[1].id).toEqual(ids[1]);
  });

  it('returns only requested cards in order Array<ExportedCard>', () => {
    const ids = [
      { id: '56a1afab-782c-4f31-96f5-17b676852fea' },
      { id: '5d87893f-36e0-4621-a139-fedbc74ed4c5' },
    ];
    const cards = provider.getCardList(ids);
    expect(cards).toHaveLength(2);
    expect(cards[0].id).toEqual(ids[0].id);
    expect(cards[1].id).toEqual(ids[1].id);
  });
});

describe('CardProvider.getPlaneCards', () => {
  it('returns only planes', () => {
    const planes = provider.getPlaneCards();
    expect(planes).toHaveLength(78);
    expect(planes.every(p => p instanceof Plane)).toBe(true);
  });
});

describe('CardProvider.getPhenomenonCards', () => {
  it('returns only phenomena', () => {
    const phenomena = provider.getPhenomenonCards();
    expect(phenomena).toHaveLength(8);
    expect(phenomena.every(p => p instanceof Phenomenon)).toBe(true);
  });
});

describe('CardProvider.getDeck', () => {
  it('returns a shuffled deck with all cards available', () => {
    expect(provider.getDeck().remaining).toEqual(86);
  });
});

describe('CardProvider.getPlaneDeck', () => {
  it('returns a deck with only planes', () => {
    const planeDeck = provider.getPlaneDeck();
    expect(planeDeck.remaining).toEqual(78);
    while (planeDeck.remaining > 0) {
      expect(planeDeck.draw()).toBeInstanceOf(Plane);
    }
  });
});

describe('CardProvider.getPhenomenonDeck', () => {
  it('returns a deck with only phenomena', () => {
    const phenomenonDeck = provider.getPhenomenonDeck();
    expect(phenomenonDeck.remaining).toEqual(8);
    while (phenomenonDeck.remaining > 0) {
      expect(phenomenonDeck.draw()).toBeInstanceOf(Phenomenon);
    }
  });
});

describe('CardProvider.getCustomDeck', () => {
  it('returns a deck with only requested cards', () => {
    const ids = [
      '56a1afab-782c-4f31-96f5-17b676852fea',
      '5d87893f-36e0-4621-a139-fedbc74ed4c5',
    ];
    const deck = provider.getCustomDeck(ids);
    expect(deck.remaining).toEqual(2);
    while (deck.remaining > 0) {
      expect(ids).toContain(deck.draw().id);
    }
  });
});

describe('CardProvider.restoreDeck', () => {
  it('returns a Deck from a DeckState', () => {
    const deck = provider.restoreDeck({
      cards: [{ id: '56a1afab-782c-4f31-96f5-17b676852fea' }],
      played: [{ id: '5d87893f-36e0-4621-a139-fedbc74ed4c5' }],
    });
    expect(deck.remaining).toEqual(1);
    expect(deck.played).toHaveLength(1);
    expect(deck.played[0].id).toEqual('5d87893f-36e0-4621-a139-fedbc74ed4c5');
    expect(deck.draw().id).toEqual('56a1afab-782c-4f31-96f5-17b676852fea');
  });
});
