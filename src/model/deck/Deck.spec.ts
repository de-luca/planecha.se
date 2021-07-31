import { DeckProvider } from '@/services/DeckProvider';
import { Container } from 'typedi';
import { Card, Plane } from '../card';

const provider = Container.get(DeckProvider);

describe('Deck.draw', () => {
  it('draws a card', () => {
    const deck = provider.getDeck();
    const drawn = deck.draw();
    expect(drawn.card).toBeInstanceOf(Card);
    expect(drawn.shuffled).toEqual(false);
    expect(deck.remaining).toEqual(85);
  });

  it('reshuffle and draws a card', () => {
    const deck = provider.getDeck();
    deck['playedCards'] = deck['cards'];
    deck['cards'] = [];

    const drawn = deck.draw();

    expect(drawn.card).toBeInstanceOf(Card);
    expect(drawn.shuffled).toEqual(true);
    expect(deck.remaining).toEqual(85);
    expect(deck.played).toHaveLength(0);
  });
});

describe('Deck.play', () => {
  it('sets a played card in the played pile', () => {
    const deck = provider.getDeck();
    const drawn = deck.draw();
    deck.play(drawn.card);
    expect(deck.remaining).toEqual(85);
    expect(deck.played).toHaveLength(1);
  });
});

describe('Deck.drawPlane', () => {
  it('draws a plane', () => {
    const deck = provider.getDeck();
    const drawn = deck.drawPlane();
    expect(drawn.card).toBeInstanceOf(Plane);
    expect(drawn.shuffled).toEqual(false);
    expect(deck.remaining).toEqual(85);
  });
});

describe('Deck.shuffle', () => {
  it('shuffled played cards back', () => {
    const deck = provider.getDeck();
    deck['playedCards'] = deck['cards'];
    deck['cards'] = [];

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
    expect(revealed.shuffled).toEqual(false);
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
    // pick a card from the deck
    const card = deck['cards'][1];

    deck.putOnTop([ card ]);
    // we actually copied the card in that test
    expect(deck.remaining).toEqual(87);
    expect(deck['cards'][0]).toEqual(card);
  });
});

describe('Deck.putOnTheBottom', () => {
  it('puts given cards on the bottom of the deck', () => {
    const deck = provider.getDeck();
    // pick a card from the deck
    const card = deck['cards'][1];

    deck.putOnTheBottom([ card ]);
    // we actually copied the card in that test
    expect(deck.remaining).toEqual(87);
    expect(deck['cards'][deck.remaining - 1]).toEqual(card);
  });
});
