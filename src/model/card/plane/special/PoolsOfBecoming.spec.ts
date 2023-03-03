import { describe, it, expect, vi } from 'vitest';
import { PoolsOfBecoming } from './PoolsOfBecoming';
import { RevealerMode, RevealerSource, StateKey, WallStates } from '#/model/wall';
import { eventBus, EventType } from '#/services/EventBus';

vi.mock('#/services/EventBus');

describe('PoolOfBecoming.chaos', () => {
  it('sets a wall and emit its event', () => {
    const walls = new WallStates();
    const poolOfBecoming = new PoolsOfBecoming({
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Test Plane',
      typeLine: 'test plane',
      oracleText: 'some test text',
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
    expect(eventBus.emit).toBeCalledWith(EventType.POOLS_OF_BECOMING);
  });
});
