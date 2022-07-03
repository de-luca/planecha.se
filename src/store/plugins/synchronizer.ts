import { PiniaPluginContext } from 'pinia';
import { useMain } from '../main';

const action = 'pushPatch';

/**
 * Version store plugin
 * Listen to pushPatch
 * Broadcast new patch to peers if online
 */
export function createSynchronizer(context: PiniaPluginContext) {
  const main = useMain();
  if (context.store.$id === 'version') {
    context.store.$onAction(({ after, store, name }) => {
      if (name === action) {
        after(() => { main.sync(store.lastPatch); });
      }
    }, true);
  }
}
