import { describe, it, beforeEach, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useMain } from './main';
import { BuildProps, Single, MapType } from '#/model/map';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('default state', () => {
  it('has empty data', () => {
    const store = useMain();
    expect(store.net).toBeUndefined();
    expect(() => { store.map; }).toThrow();
    expect(store.mates.size).toBe(0);
    expect(store.feed).toHaveLength(0);
  });
});

describe('init', () => {
  it('inits with a map and data', async() => {
    const store = useMain();
    const props: BuildProps = { type: MapType.SINGLE };
    await store.init(props);
    expect(store.net).toBeUndefined();
    expect(store.map).toBeInstanceOf(Single);
    expect(store.mates.size).toBe(0);
    expect(store.feed).toHaveLength(0);
  });
});

describe('leave', () => {
  it('cleans store', async () => {
    const store = useMain();
    const props: BuildProps = { type: MapType.SINGLE };
    await store.init(props);
    store.leave();
    expect(store.net).toBeUndefined();
    expect(() => { store.map; }).toThrow();
    expect(store.mates.size).toBe(0);
    expect(store.feed).toHaveLength(0);
  });
});
