import { eventBus, EventType } from '@/services/EventBus';
import { describe, it, expect, vi } from 'vitest';
import { Aretopolis } from './Aretopolis';

vi.mock('@/services/EventBus');

describe('Aretopolis.chaos', () => {
  it('increase counter value of 1', () => {
    const aretopolis = new Aretopolis({
      id: '00000000-0000-0000-0000-000000000000',
      oracleId: '12345',
      multiverseIds: [1, 2, 3],
      name: 'Test Plane',
      scryfallUri: 'https://test.plane/',
      typeLine: 'test plane',
      oracleText: 'some test text',
      gathererUri: 'https://test.plane/',
      counter: {
        max: 10,
        name: 'test counter',
        reset: true,
        start: 0,
        value: 0,
      },
    });
    aretopolis.chaos();
    expect(aretopolis.counter?.value).toEqual(1);
  });
});

describe('Aretopolis.updateCounter', () => {
  it('updates counter value', () => {
    const aretopolis = new Aretopolis({
      id: '00000000-0000-0000-0000-000000000000',
      oracleId: '12345',
      multiverseIds: [1, 2, 3],
      name: 'Test Plane',
      scryfallUri: 'https://test.plane/',
      typeLine: 'test plane',
      oracleText: 'some test text',
      gathererUri: 'https://test.plane/',
      counter: {
        max: 10,
        name: 'test counter',
        reset: true,
        start: 0,
        value: 0,
      },
    });
    aretopolis.updateCounter(5);
    expect(aretopolis.counter?.value).toEqual(5);
    expect(eventBus.emit).not.toHaveBeenCalled();
  });

  it('updates counter value and emit event if at max', () => {
    const aretopolis = new Aretopolis({
      id: '00000000-0000-0000-0000-000000000000',
      oracleId: '12345',
      multiverseIds: [1, 2, 3],
      name: 'Test Plane',
      scryfallUri: 'https://test.plane/',
      typeLine: 'test plane',
      oracleText: 'some test text',
      gathererUri: 'https://test.plane/',
      counter: {
        max: 10,
        name: 'test counter',
        reset: true,
        start: 0,
        value: 0,
      },
    });
    aretopolis.updateCounter(10);
    expect(aretopolis.counter?.value).toEqual(10);
    expect(eventBus.emit).toBeCalledWith(EventType.ARETOPOLIS);
  });
});
