import { RevealerMode, RevealerSource, StateKey, WallStates } from '@/model/wall';
import { describe, it, expect } from 'vitest';
import { SpatialMerging } from './SpatialMerging';

describe('SpatialMerging.enter', () => {
  it('sets a wall and emit its event', () => {
    const walls = new WallStates();
    const spatialMerging = new SpatialMerging({
      id: '00000000-0000-0000-0000-000000000000',
      oracleId: '12345',
      multiverseIds: [1, 2, 3],
      name: 'Test Phenomenon',
      scryfallUri: 'https://test.phenomenon/',
      typeLine: 'test phenomenon',
      oracleText: 'some test text',
      gathererUri: 'https://test.phenomenon/',
    });
    spatialMerging.enter(walls, 'foo');
    expect(walls.get(StateKey.REVEALER)).toEqual({
      title: 'Test Phenomenon',
      subTitle: 'You\'ll planeswalk to these two planes simultaneously.',
      source: RevealerSource.SPACIAL_MERGING,
      component: RevealerMode.SHOW,
      sendShownTo: 'top',
      initiator: 'foo',
    });
  });
});
