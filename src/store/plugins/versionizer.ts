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
        after(() => {
          const test = store.repo.commit(name, store.map.dump());
          console.log(test);
          store.sync(test);
        });
      }
    }, true);
  }
}
