import { Container } from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { Classic } from '.';
import { Plane } from '../card';
import { MapType } from './MapInterface';

describe('Classic.type', () => {
  it('returns the type', () => {
    const map = new Classic({
      deck: Container.get(DeckProvider).getDeck(),
    });

    expect(map.type).toEqual(MapType.CLASSIC);
  });
});

describe('Classic.drawPlane', () => {
  it('draws a plane', () => {
    const map = new Classic({
      deck: Container.get(DeckProvider).getDeck(),
    });

    const drawn = map['drawPlane']();

    expect(drawn.card).toBeInstanceOf(Plane);
    expect(drawn.shuffled).toEqual(false);
    expect(map.deck).toHaveLength(84);
  });
});

describe('Classic.planeswalk', () => {
  it('changes active card', () => {
    const map = new Classic({
      deck: Container.get(DeckProvider).getDeck(),
    });
    const startCard = map.active;
    const deckSize = map.deck.length;
    const playedSize = map.played.length;

    map.planeswalk();

    expect(map.active).not.toEqual(startCard);
    expect(map.deck.length).toBeLessThan(deckSize);
    expect(map.played.length).toBeGreaterThan(playedSize);
  });
});

describe('Classic.customPlaneswalk', () => {
  it('changes active card to given planes', () => {
    const map = new Classic({
      deck: Container.get(DeckProvider).getDeck(),
    });
    const startCard = map.active;
    const deckSize = map.deck.length;
    const playedSize = map.played.length;

    map.revealUntil(2, Plane);
    map.customPlaneswalk(map.revealed?.relevant as Array<Plane>);
    map.resolveReveal([], map.revealed?.others ?? []);

    expect(map.active).not.toEqual(startCard);
    expect(map.active).toHaveLength(2);
    expect(map.deck.length).toBeLessThan(deckSize);
    expect(map.played.length).toBeGreaterThan(playedSize);
  });
});
