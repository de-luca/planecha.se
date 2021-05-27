import Container from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { Classic } from '.';
import { Plane } from '../card';

describe('Classic.drawPlane', () => {
  it('draws a plane', () => {
    const map = new Classic({
      deck: Container.get(DeckProvider).getDeck(),
    });

    expect(map['drawPlane']()).toBeInstanceOf(Plane);
    expect(map['deck']).toHaveLength(84);
  });
});

describe('Classic.planeswalk', () => {
  it('changes active card', () => {
    const map = new Classic({
      deck: Container.get(DeckProvider).getDeck(),
    });
    const startCard = map['active'];
    const deckSize = map['deck'].length;
    const playedSize = map['played'].length;

    map.planeswalk();

    expect(map['active']).not.toEqual(startCard);
    expect(map['deck'].length).toBeLessThan(deckSize);
    expect(map['played'].length).toBeGreaterThan(playedSize);
  });
});
