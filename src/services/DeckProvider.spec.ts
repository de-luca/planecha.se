import Container from 'typedi';
import { Plane } from '../model/card';
import { DeckProvider } from './DeckProvider';

const provider = Container.get(DeckProvider);

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
