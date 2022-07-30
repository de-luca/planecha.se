import { PiniaPluginContext } from 'pinia';
import { diff } from '@n1ru4l/json-patch-plus';

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
    context.store.$onAction(({ after, store, name }) => {
      if (actions.includes(name)) {
        after(() => {
          const newVersion = store.map.export();
          const patch = {
            event: name,
            delta: diff({ left: store.repository.getStash(), right: newVersion }),
          };
          store.repository.apply(patch);
          store.repository.setStash(newVersion);
          store.sync(patch);
        });
      }
    }, true);
  }
}
