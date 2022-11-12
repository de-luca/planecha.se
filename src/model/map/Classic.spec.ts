import { describe, it, expect } from 'vitest';
import { Plane } from '../card';
import { WallStates } from '../wall';
import { Classic, MapType } from '.';
import { CardProvider } from '@/services/CardProvider';

describe('Classic.type', () => {
  it('returns the type', () => {
    const map = new Classic({
      deck: CardProvider.getDeck(),
      wallStates: new WallStates(),
    });

    expect(map.specs.type).toEqual(MapType.CLASSIC);
  });
});

describe('Classic.planeswalk', () => {
  it('changes active card', () => {
    const map = new Classic({
      deck: CardProvider.getDeck(),
      wallStates: new WallStates(),
    });
    const startCard = map.active;
    const deckSize = map.remaining;
    const playedSize = map.played.length;

    map.planeswalk({ initiator: 'foo' });

    expect(map.active).not.toEqual(startCard);
    expect(map.remaining).toBeLessThan(deckSize);
    expect(map.played.length).toBeGreaterThan(playedSize);
  });

  it('changes active card to given planes', () => {
    const map = new Classic({
      deck: CardProvider.getDeck(),
      wallStates: new WallStates(),
    });
    const startCard = map.active;
    const deckSize = map.remaining;
    const playedSize = map.played.length;

    map.revealUntil({ count: 2, type: Plane });
    map.planeswalk({
      initiator: 'foo',
      planes: map.revealed?.relevant as Array<Plane>,
    });
    map.resolveReveal({
      top: [],
      bottom: map.revealed?.others ?? [],
    });

    expect(map.active).not.toEqual(startCard);
    expect(map.active).toHaveLength(2);
    expect(map.remaining).toBeLessThan(deckSize);
    expect(map.played.length).toBeGreaterThan(playedSize);
  });
});
