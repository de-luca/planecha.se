import { describe, it, beforeEach, expect, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { createApp } from 'vue';
import { BuildProps, MapType } from '@/model/map';
import { useMain } from '../main';
import { versionizer } from './versionizer';

beforeEach(() => {
  const pinia = createPinia().use(versionizer);
  createApp({}).use(pinia);
  setActivePinia(pinia);
});

describe('versionizer', () => {
  it('stores last version of the map', async() => {
    const store = useMain();
    const syncSpy = vi.spyOn(store, 'sync');
    const props: BuildProps = {
      online: false,
      type: MapType.CLASSIC,
      advanced: {},
    };
    await store.init(props);
    store.startGame();
    expect(store.repo.getStash()).not.toBeUndefined();
    expect(syncSpy).toBeCalled();
  });
});
