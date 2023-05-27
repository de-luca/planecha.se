import { PiniaPluginContext } from 'pinia';
import { isMain } from '../main';

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

export function versionizer({ store }: PiniaPluginContext) {
  if (isMain(store)) {
    store.$onAction(({ after, store, name }) => {
      if (actions.includes(name)) {
        after(() => store.sync(store.repo.commit(name, store.map.dump())));
      }
    }, true);
  }
}
