import { PiniaPluginContext } from 'pinia';
import { diff } from '@n1ru4l/json-patch-plus';
import { useVersion } from '../version';
import { EmptyMap } from '@/model/map';

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
  const version = useVersion();

  if (context.store.$id === 'main') {
    context.store.$onAction(({ after, store, name }) => {
      if (actions.includes(name)) {
        after(() => {
          const newVersion = store.map.export();
          version.pushPatch({
            playHead: version.nextPlayHead,
            event: name,
            delta: diff({ left: version.head, right: newVersion }),
          });
          version.setHead(newVersion);
        });
      }
    }, true);
  }
}
