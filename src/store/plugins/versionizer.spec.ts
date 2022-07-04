import { describe, it, beforeEach, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { createApp } from 'vue';
import { BuildProps, MapType } from '@/model/map';
import { useMain } from '../main';
import { useVersion } from '../version';
import { versionizer } from './versionizer';

beforeEach(() => {
  const pinia = createPinia().use(versionizer);
  createApp({}).use(pinia);
  setActivePinia(pinia);
});

describe('versionizer', () => {
  it('stores last version of the map', async() => {
    const store = useMain();
    const version = useVersion();
    const props: BuildProps = {
      online: false,
      type: MapType.CLASSIC,
      advanced: {},
    };
    await store.init(props);
    store.startGame();
    expect(version.head).not.toBeUndefined();
  });

  it('stores patches', async () => {
    const store = useMain();
    const version = useVersion();
    const props: BuildProps = {
      online: false,
      type: MapType.CLASSIC,
      advanced: {},
    };
    await store.init(props);
    store.startGame();
    store.planeswalk({});
    expect(version.head).toEqual(store.map.export());
    expect(version.patches).toHaveLength(3);
    expect(version.patches[0].playHead).toEqual(0);
    expect(version.patches[1].playHead).toEqual(1);
    expect(version.patches[2].playHead).toEqual(2);
    expect(version.patches[0].event).toEqual('init');
    expect(version.patches[1].event).toEqual('startGame');
    expect(version.patches[2].event).toEqual('planeswalk');
  });
});
