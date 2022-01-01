import { PiniaPluginContext } from 'pinia';
import { EmptyMap } from '@/model/map';

const actions = [
  'startGame',
  'planeswalk',
  'encounter',
  'reveal',
];

export function createVersionizer(context: PiniaPluginContext) {
  if (context.store.$id === 'main') {
    context.store.$onAction(({ store, name }) => {
      if (!(store.map instanceof EmptyMap) && actions.includes(name)) {
        store.versionBuffer = store.map.export();
      }
    }, true);
  }
}
