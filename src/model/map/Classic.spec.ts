import { Classic } from '.';
import { Plane } from '../card';

describe('Classic.drawPlane', () => {
  it('draws a plane', () => {
    const map = new Classic();

    expect(map['drawPlane']()).toBeInstanceOf(Plane.Plane);
    expect(map['deck']).toHaveLength(84);
  });
});

describe('Classic.planeswalk', () => {
  it('changes active card', () => {
    const map = new Classic();
    const startCard = map['active'];
    const deckSize = map['deck'].length;
    const playedSize = map['played'].length;

    map.planeswalk();

    expect(map['active']).not.toEqual(startCard);
    expect(map['deck'].length).toBeLessThan(deckSize);
    expect(map['played'].length).toBeGreaterThan(playedSize);
  });
});
