import { PiniaPluginContext } from 'pinia';
import type { MainStore } from '../main';

const actions = [
  'init',
  'startGame',
  'planeswalk',
  'customPlaneswalk',
  'encounter',
  'resolve',
  'reveal',
  'resolveReveal',
  'updateCounters',
  'updateWallState',
];

export function versionizer(context: PiniaPluginContext) {
  if (context.store.$id === 'main') {
    const store = context.store as MainStore;
    store.$onAction(({ after, store, name }) => {
      if (actions.includes(name)) {
        after(() => store.sync(store.repo.commit(name, store.map.dump())));
      }
    }, true);
  }
}
