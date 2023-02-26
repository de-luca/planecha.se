import { PiniaPluginContext } from 'pinia';

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
        after(() => store.sync(
          store.repo.commit(name, store.map.export()),
        ));
      }
    }, true);
  }
}
