import { describe, expect, it, mock } from 'bun:test';
import { PoolsOfBecoming } from './PoolsOfBecoming';
import { RevealerMode, RevealerSource, StateKey, WallManager } from '#/model/wall';
import { eventBus, EventType } from '#/services/EventBus';

mock.module('#/services/EventBus', () => ({
  eventBus: { emit: mock() },
}));

describe('PoolOfBecoming.chaos', () => {
  it('sets a wall and emit its event', () => {
    const walls = new WallManager();
    const poolOfBecoming = new PoolsOfBecoming({
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Test Plane',
      typeLine: 'test plane',
      oracleText: 'some test text',
      isUB: true,
      sets: ['ABC'],
    });
    poolOfBecoming.chaos(walls, 'foo');
    expect(walls.get(StateKey.REVEALER)).toEqual({
      title: 'Test Plane',
      subTitle: 'Chaos from these cards will trigger.',
      source: RevealerSource.POOLS_OF_BECOMING,
      component: RevealerMode.SHOW,
      sendShownTo: 'bottom',
      initiator: 'foo',
    });
    expect(eventBus.emit).toHaveBeenCalledWith(EventType.POOLS_OF_BECOMING);
  });
});
