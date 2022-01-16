import { Container } from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { Classic, MapType } from '.';
import { Plane } from '../card';
import { WallStates } from '../wall';

jest.mock('@/services/getEnv');

describe('Classic.type', () => {
  it('returns the type', () => {
    const map = new Classic({
      deck: Container.get(DeckProvider).getDeck(),
      states: new WallStates(),
    });

    expect(map.specs.type).toEqual(MapType.CLASSIC);
  });
});

describe('Classic.planeswalk', () => {
  it('changes active card', () => {
    const map = new Classic({
      deck: Container.get(DeckProvider).getDeck(),
      states: new WallStates(),
    });
    const startCard = map.active;
    const deckSize = map.remaining;
    const playedSize = map.played.length;

    map.planeswalk();

    expect(map.active).not.toEqual(startCard);
    expect(map.remaining).toBeLessThan(deckSize);
    expect(map.played.length).toBeGreaterThan(playedSize);
  });
});

describe('Classic.customPlaneswalk', () => {
  it('changes active card to given planes', () => {
    const map = new Classic({
      deck: Container.get(DeckProvider).getDeck(),
      states: new WallStates(),
    });
    const startCard = map.active;
    const deckSize = map.remaining;
    const playedSize = map.played.length;

    map.revealUntil(2, Plane);
    map.customPlaneswalk(map.revealed?.relevant as Array<Plane>);
    map.resolveReveal([], map.revealed?.others ?? []);

    expect(map.active).not.toEqual(startCard);
    expect(map.active).toHaveLength(2);
    expect(map.remaining).toBeLessThan(deckSize);
    expect(map.played.length).toBeGreaterThan(playedSize);
  });
});
