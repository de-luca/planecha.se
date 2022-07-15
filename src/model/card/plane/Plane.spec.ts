import { describe, it, expect } from 'vitest';
import { Plane } from './Plane';

describe('Plane.initCounter', () => {
  it('sets counter value to its start', () => {
    const plane = new Plane({
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
        start: 5,
        value: 0,
      },
    });

    plane.initCounter();
    expect(plane.counter?.value).toEqual(5);
  });
});

describe('Plane.updateCounter', () => {
  it('updates counter value', () => {
    const plane = new Plane({
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
    plane.updateCounter(5);
    expect(plane.counter?.value).toEqual(5);
  });

  it('updates counter value not less that 0', () => {
    const plane = new Plane({
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
        value: 5,
      },
    });
    plane.updateCounter(-10);
    expect(plane.counter?.value).toEqual(0);
  });
});

describe('Plane.leave', () => {
  it('resets counter to start value if resetable', () => {
    const plane = new Plane({
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
        value: 6,
      },
    });
    expect(plane.counter?.value).toEqual(6);
    plane.leave();
    expect(plane.counter?.value).toEqual(0);
  });

  it('keeps counter to old value if not resetable', () => {
    const plane = new Plane({
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
        reset: false,
        start: 0,
        value: 6,
      },
    });
    expect(plane.counter?.value).toEqual(6);
    plane.leave();
    expect(plane.counter?.value).toEqual(6);
  });
});

describe('Plane.export', () => {
  it('exports the state of the plane (no counters)', () => {
    const plane = new Plane({
      id: '00000000-0000-0000-0000-000000000000',
      oracleId: '12345',
      multiverseIds: [1, 2 ,3],
      name: 'Test Plane',
      scryfallUri: 'https://test.plane/',
      typeLine: 'test plane',
      oracleText: 'some test text',
      gathererUri: 'https://test.plane/',
    });

    expect(plane.export()).toEqual({
      id: '00000000-0000-0000-0000-000000000000',
    });
  });

  it('exports the state of the plane (with counters)', () => {
    const plane = new Plane({
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
        start: 5,
        value: 6,
      },
    });

    expect(plane.export()).toEqual({
      id: '00000000-0000-0000-0000-000000000000',
      counters: 6,
    });
  });
});
