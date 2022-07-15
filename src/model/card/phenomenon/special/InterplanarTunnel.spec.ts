import { RevealerMode, RevealerSource, StateKey, WallStates } from '@/model/wall';
import { describe, it, expect } from 'vitest';
import { InterplanarTunnel } from './InterplanarTunnel';

describe('SpatialMerging.enter', () => {
  it('sets a wall and emit its event', () => {
    const walls = new WallStates();
    const interplanarTunnel = new InterplanarTunnel({
      id: '00000000-0000-0000-0000-000000000000',
      oracleId: '12345',
      multiverseIds: [1, 2, 3],
      name: 'Test Phenomenon',
      scryfallUri: 'https://test.phenomenon/',
      typeLine: 'test phenomenon',
      oracleText: 'some test text',
      gathererUri: 'https://test.phenomenon/',
    });
    interplanarTunnel.enter(walls, 'foo');
    expect(walls.get(StateKey.REVEALER)).toEqual({
      title: 'Test Phenomenon',
      subTitle: 'Chose a plane to put on top the planar deck.',
      source: RevealerSource.INTERPLANAR_TUNNEL,
      component: RevealerMode.PICK,
      sendShownTo: 'top',
      initiator: 'foo',
    });
  });
});
