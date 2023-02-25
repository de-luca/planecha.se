import { describe, it, expect } from 'vitest';
import { InterplanarTunnel } from './InterplanarTunnel';
import { RevealerMode, RevealerSource, StateKey, WallStates } from '@/model/wall';

describe('SpatialMerging.enter', () => {
  it('sets a wall and emit its event', () => {
    const walls = new WallStates();
    const interplanarTunnel = new InterplanarTunnel({
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Test Phenomenon',
      typeLine: 'test phenomenon',
      oracleText: 'some test text',
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
