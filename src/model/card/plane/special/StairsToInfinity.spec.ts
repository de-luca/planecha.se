import { RevealerMode, RevealerSource, StateKey, WallStates } from '@/model/wall';
import { eventBus, EventType } from '@/services/EventBus';
import { describe, it, expect, vi } from 'vitest';
import { StairsToInfinity } from './StairsToInfinity';

vi.mock('@/services/EventBus');

describe('StairsToInfinity.chaos', () => {
  it('sets a wall and emit its event', () => {
    const walls = new WallStates();
    const stairsToInfinity = new StairsToInfinity({
      id: '00000000-0000-0000-0000-000000000000',
      oracleId: '12345',
      multiverseIds: [1, 2, 3],
      name: 'Test Plane',
      scryfallUri: 'https://test.plane/',
      typeLine: 'test plane',
      oracleText: 'some test text',
      gathererUri: 'https://test.plane/',
    });
    stairsToInfinity.chaos(walls, 'foo');
    expect(walls.get(StateKey.REVEALER)).toEqual({
      title: 'Test Plane',
      subTitle: 'Chose to put this card on top or at the bottom the planar deck.',
      source: RevealerSource.STAIRS_TO_INFINITY,
      component: RevealerMode.SCRY,
      sendShownTo: 'bottom',
      initiator: 'foo',
    });
    expect(eventBus.emit).toBeCalledWith(EventType.STAIRS_TO_INFINITY);
  });
});
