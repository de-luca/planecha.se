import { describe, it, expect } from 'vitest';
import { Phenomenon, Plane } from '../model/card';
import { CardProvider } from './CardProvider';

describe('CardProvider.getCard', () => {
  it('returns a single card', () => {
    const card = CardProvider.getCard('43a23de7-0738-4b03-b87d-5a7d1144825c');
    expect(card.name).toEqual('Glimmervoid Basin');
  });
});

describe('CardProvider.getAllCards', () => {
  it('returns all the cards', () => {
    expect(CardProvider.getAllCards()).toHaveLength(87);
  });
});

describe('CardProvider.getCardList', () => {
  it('returns only requested cards in order (Array<string>)', () => {
    const ids = [
      '15b979de-c8ee-4664-9ca7-6c4eb3346967',
      '38f84e55-049c-441e-b4e2-1e207ab5dbe5',
    ];
    const cards = CardProvider.getCardList(ids);
    expect(cards).toHaveLength(2);
    expect(cards[0].id).toEqual(ids[0]);
    expect(cards[1].id).toEqual(ids[1]);
  });

  it('returns only requested cards in order Array<ExportedCard>', () => {
    const ids = [
      { id: '15b979de-c8ee-4664-9ca7-6c4eb3346967' },
      { id: '38f84e55-049c-441e-b4e2-1e207ab5dbe5' },
    ];
    const cards = CardProvider.getCardList(ids);
    expect(cards).toHaveLength(2);
    expect(cards[0].id).toEqual(ids[0].id);
    expect(cards[1].id).toEqual(ids[1].id);
  });
});

describe('CardProvider.getPlaneCards', () => {
  it('returns only planes', () => {
    const planes = CardProvider.getPlaneCards();
    expect(planes).toHaveLength(79);
    expect(planes.every(p => p instanceof Plane)).toBe(true);
  });
});

describe('CardProvider.getPhenomenonCards', () => {
  it('returns only phenomena', () => {
    const phenomena = CardProvider.getPhenomenonCards();
    expect(phenomena).toHaveLength(8);
    expect(phenomena.every(p => p instanceof Phenomenon)).toBe(true);
  });
});

describe('CardProvider.getDeck', () => {
  it('returns a shuffled deck with all cards available', () => {
    expect(CardProvider.getDeck().remaining).toEqual(87);
  });
});

describe('CardProvider.getPlaneDeck', () => {
  it('returns a deck with only planes', () => {
    const planeDeck = CardProvider.getPlaneDeck();
    expect(planeDeck.remaining).toEqual(79);
    while (planeDeck.remaining > 0) {
      expect(planeDeck.draw()).toBeInstanceOf(Plane);
    }
  });
});

describe('CardProvider.getPhenomenonDeck', () => {
  it('returns a deck with only phenomena', () => {
    const phenomenonDeck = CardProvider.getPhenomenonDeck();
    expect(phenomenonDeck.remaining).toEqual(8);
    while (phenomenonDeck.remaining > 0) {
      expect(phenomenonDeck.draw()).toBeInstanceOf(Phenomenon);
    }
  });
});

describe('CardProvider.getCustomDeck', () => {
  it('returns a deck with only requested cards', () => {
    const ids = [
      '15b979de-c8ee-4664-9ca7-6c4eb3346967',
      '38f84e55-049c-441e-b4e2-1e207ab5dbe5',
    ];
    const deck = CardProvider.getCustomDeck(ids);
    expect(deck.remaining).toEqual(2);
    while (deck.remaining > 0) {
      expect(ids).toContain(deck.draw().id);
    }
  });
});

describe('CardProvider.restoreDeck', () => {
  it('returns a Deck from a DeckState', () => {
    const deck = CardProvider.restoreDeck({
      cards: [{ id: '15b979de-c8ee-4664-9ca7-6c4eb3346967' }],
      played: [{ id: '38f84e55-049c-441e-b4e2-1e207ab5dbe5' }],
    });
    expect(deck.remaining).toEqual(1);
    expect(deck.played).toHaveLength(1);
    expect(deck.played[0].id).toEqual('38f84e55-049c-441e-b4e2-1e207ab5dbe5');
    expect(deck.draw().id).toEqual('15b979de-c8ee-4664-9ca7-6c4eb3346967');
  });
});
