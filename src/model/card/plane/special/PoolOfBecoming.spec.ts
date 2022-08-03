import { describe, it, expect, vi } from 'vitest';
import { PoolOfBecoming } from './PoolOfBecoming';
import { RevealerMode, RevealerSource, StateKey, WallStates } from '@/model/wall';
import { eventBus, EventType } from '@/services/EventBus';

vi.mock('@/services/EventBus');

describe('PoolOfBecoming.chaos', () => {
  it('sets a wall and emit its event', () => {
    const walls = new WallStates();
    const poolOfBecoming = new PoolOfBecoming({
      id: '00000000-0000-0000-0000-000000000000',
      oracleId: '12345',
      multiverseIds: [1, 2, 3],
      name: 'Test Plane',
      scryfallUri: 'https://test.plane/',
      typeLine: 'test plane',
      oracleText: 'some test text',
      gathererUri: 'https://test.plane/',
    });
    poolOfBecoming.chaos(walls, 'foo');
    expect(walls.get(StateKey.REVEALER)).toEqual({
      title: 'Test Plane',
      subTitle: 'Chaos from these cards will trigger.',
      source: RevealerSource.POOL_OF_BECOMING,
      component: RevealerMode.SHOW,
      sendShownTo: 'bottom',
      initiator: 'foo',
    });
    expect(eventBus.emit).toBeCalledWith(EventType.POOL_OF_BECOMING);
  });
});
