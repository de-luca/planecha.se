import { PiniaPluginContext, StoreGeneric, StoreOnActionListener, StoreOnActionListenerContext } from 'pinia';
import { Payload } from '@/store/main';
import { BuildProps } from '@/model/map';
import { Card, Plane } from '@/model/card';

const chaos = '<abbr class="symbol chaos" title="chaos">{CHAOS}</abbr>';
const plnwlk = '<abbr class="symbol planeswalk" title="planeswalk">{CHAOS}</abbr>';

function name(state: StoreGeneric, id?: string): string {
  return id
    ? state.mates.get(id) as string
    : 'You';
}

export function createFeeder(context: PiniaPluginContext) {
  if (context.store.$id === 'main') {
    context.store.$onAction(({ after, name: action, args, store }) => {
      after(() => {
        switch (action) {
          case 'undo':
            const payload = args[0] as Payload.Undo;
            store.feed.push(`<b>${name(store, payload?.passivity?.initiator)}</b> undone last action`);
            break;
          case 'init': {
            const payload = args[0] as BuildProps;
            const type = payload.type === 'classic'
              ? 'Classic'
              : 'Eternities Map';
            store.feed.push(`<b>You</b> created new game <b>${type}</b>`);
            break;
          }
          case 'startGame': {
            store.feed.push(`Game starts on <b>${store.map.active[0].name}</b>`);
            break;
          }
          case 'hey': {
            const payload = args[0] as Payload.Hey;
            store.feed.push(`<b>${payload.name}</b> joined game`);
            break;
          }
          case 'planeswalk': {
            const payload = args[0] as Payload.Planeswalk;
            const message = `<b>${name(store, payload?.passivity?.initiator)}</b> ` +
              (store.map?.active[0].type === 'plane' ? `${plnwlk} to` : 'encountered') +
              ` <b>${store.map?.active[0].name}</b>`;
            store.feed.push(message);
            break;
          }
          case 'customPlaneswalk': {
            const payload = args[0] as Payload.CustomPlaneswalk;
            const message = `<b>${name(store, payload?.passivity?.initiator)}</b> ${plnwlk} to ` +
              `<b>${store.map?.active.map((c: Card) => c.name).join('</b> and <b>')}</b>`;
            store.feed.push(message);
            break;
          }
          case 'chaos': {
            const payload = args[0] as Payload.Passiveable;
            const message = `<b>${name(store, payload?.passivity?.initiator)}</b> triggered ${chaos} ` +
              `on <b>${store.map?.active.map((c: Card) => c.name).join('</b> and <b>')}</b>`;
            store.feed.push(message);
            break;
          }
          case 'updateCounters': {
            const payload = args[0] as Payload.Counters;
            const plane = store.map.active.find((c: Card) => c.id === payload.planeId) as Plane;
            const message = `<b>${name(store, payload?.passivity?.initiator)}</b> ` +
              `${payload.change > 0 ? 'added ' : 'removed '} <b>${Math.abs(payload.change)}</b> ` +
              `(<b>${plane.counter?.value}</b>) counter on ` +
              `<b>${plane.name}</b>`;
            store.feed.push(message);
            break;
          }
          case 'resolveReveal': {
            const payload = args[0] as Payload.ResolveReveal;
            if (payload.top.length > 0) {
              store.feed.push(
                `<b>${name(store, payload?.passivity?.initiator)}</b> putted on top ` +
                `<b>${payload.top.map(c => c.name).join('</b>, <b>')}</b>`,
              );
            }
            if (payload.bottom.length > 0) {
              store.feed.push(
                `<b>${name(store, payload?.passivity?.initiator)}</b> putted at the bottom ` +
                `<b>${payload.bottom.map(c => c.name).join('</b>, <b>')}</b>`,
              );
            }
            break;
          }
        }
      });
    }, true);
  }
}
