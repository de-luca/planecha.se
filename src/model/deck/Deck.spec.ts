import { describe, it, expect, vi } from 'vitest';
import { Container } from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { Card, Plane } from '../card';

const provider = Container.get(DeckProvider);

describe('Deck.draw', () => {
  it('draws a card', () => {
    const deck = provider.getDeck();
    expect(deck.remaining).toEqual(86);
    const drawn = deck.draw();
    expect(drawn).toBeInstanceOf(Card);
    expect(deck.remaining).toEqual(85);
  });

  it('reshuffle and draws a card', () => {
    const deck = provider.getDeck();
    const shuffleSpy = vi.spyOn(deck, 'shuffle');
    while(deck.remaining > 0) {
      deck.setPlayed(deck.draw());
    }
    expect(deck.played).toHaveLength(86);
    expect(deck.remaining).toEqual(0);
    const drawn = deck.draw();
    expect(drawn).toBeInstanceOf(Card);
    expect(deck.remaining).toEqual(85);
    expect(deck.played).toHaveLength(0);
    expect(shuffleSpy).toHaveBeenCalled();
  });
});

describe('Deck.setPlayed', () => {
  it('sets a played card in the played pile', () => {
    const deck = provider.getDeck();
    const drawn = deck.draw();
    deck.setPlayed(drawn);
    expect(deck.remaining).toEqual(85);
    expect(deck.played).toHaveLength(1);
  });
});

describe('Deck.drawPlane', () => {
  it('draws a plane', () => {
    const deck = provider.getDeck();
    const drawn = deck.drawPlane();
    expect(drawn).toBeInstanceOf(Plane);
    expect(deck.remaining).toEqual(85);
  });
});

describe('Deck.shuffle', () => {
  it('shuffled played cards back', () => {
    const deck = provider.getDeck();
    while(deck.remaining > 0) {
      deck.setPlayed(deck.draw());
    }
    expect(deck.played).toHaveLength(86);
    expect(deck.remaining).toEqual(0);
    deck.shuffle();
    expect(deck.remaining).toEqual(86);
    expect(deck.played).toHaveLength(0);
  });
});

describe('Deck.revealUntil', () => {
  it('reveals a given number of requested Plane', () => {
    const deck = provider.getDeck();
    const revealed = deck.revealUntil(2, Plane);
    expect(revealed.relevant).toHaveLength(2);
    for (const card of revealed.relevant) {
      expect(card).toBeInstanceOf(Plane);
    }
    for (const card of revealed.others) {
      expect(card).not.toBeInstanceOf(Plane);
    }
  });

  it('reveals a given number of requested Card', () => {
    const deck = provider.getDeck();
    const revealed = deck.revealUntil(2);
    expect(revealed.relevant).toHaveLength(2);
    expect(revealed.others).toHaveLength(0);
    for (const card of revealed.relevant) {
      expect(card).toBeInstanceOf(Card);
    }
  });
});

describe('Deck.putOnTop', () => {
  it('puts given cards on top of the deck', () => {
    const deck = provider.getDeck();
    const card = deck.draw();
    deck.putOnTop([ card ]);
    expect(deck.remaining).toEqual(86);
    expect(deck.draw()).toEqual(card);
  });
});

describe('Deck.putOnTheBottom', () => {
  it('puts given cards on the bottom of the deck', () => {
    const deck = provider.getDeck();
    const card = deck.draw();
    deck.putOnTheBottom([ card ]);
    expect(deck.remaining).toEqual(86);
    while (deck.remaining > 1) {
      deck.draw();
    }
    expect(deck.remaining).toEqual(1);
    expect(deck.draw()).toEqual(card);
  });
});
