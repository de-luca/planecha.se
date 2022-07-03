import { describe, it, beforeEach, expect } from 'vitest';
import { BuildProps, Classic, EmptyMap, MapType } from '@/model/map';
import { setActivePinia, createPinia } from 'pinia';
import { useMain } from './main';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('default state', () => {
  it('has empty data', () => {
    const store = useMain();
    expect(store.online).toBe(false);
    expect(store.map).toBeInstanceOf(EmptyMap);
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
    expect(store.online).toBe(false);
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
    expect(store.online).toBe(false);
    expect(store.map).toBeInstanceOf(EmptyMap);
    expect(store.mates.size).toBe(0);
    expect(store.feed).toHaveLength(0);
  });
});
