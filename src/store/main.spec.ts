import { describe, it, beforeEach, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useMain } from './main';
import { BuildProps, Classic, MapType } from '@/model/map';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('default state', () => {
  it('has empty data', () => {
    const store = useMain();
    expect(store.game).toBeUndefined();
    expect(() => { store.map; }).toThrow();
    expect(store.mates.size).toBe(0);
    expect(store.feed).toHaveLength(0);
  });
});

describe('init', () => {
  it('inits with a map and data', async() => {
    const store = useMain();
    const props: BuildProps = {
      online: false,
      type: MapType.CLASSIC,
      advanced: {},
    };
    await store.init(props);
    expect(store.game).toBeUndefined();
    expect(store.map).toBeInstanceOf(Classic);
    expect(store.mates.size).toBe(0);
    expect(store.feed).toHaveLength(0);
  });
});

describe('leave', () => {
  it('cleans store', async () => {
    const store = useMain();
    const props: BuildProps = {
      online: false,
      type: MapType.CLASSIC,
      advanced: {},
    };
    await store.init(props);
    store.leave();
    expect(store.game).toBeUndefined();
    expect(() => { store.map; }).toThrow();
    expect(store.mates.size).toBe(0);
    expect(store.feed).toHaveLength(0);
  });
});
