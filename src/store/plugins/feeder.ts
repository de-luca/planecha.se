import { MutationPayload } from 'vuex';
import { Plane } from '@/model/card';
import {
  MutationTypes,
  State,
  Store,
} from '..';
import { Payload } from '../states/map';

function nameExtractor(store: Store): (id?: string) => string {
  return function(id?: string): string {
    if (id) {
      return store.getters.mates.get(id) as string;
    }

    return 'You';
  };
}

function handler(store: Store): (mutation: MutationPayload, state: State) => Promise<void> {
  const name = nameExtractor(store);

  return async function(mutation: MutationPayload, state: State): Promise<void> {
    switch (mutation.type) {
      case MutationTypes.INIT: {
        if ((state.map?.active?.length ?? 0) > 0) {
          store.state.feed.push('<b>You</b> created new game <b>Classic</b>');
          store.state.feed.push(`Game starts on <b>${state.map?.active[0].name}</b>`);
        }
        break;
      }
      case MutationTypes.HEY: {
        const payload = mutation.payload as Payload.Hey;
        store.state.feed.push(`<b>${payload.name}</b> joined game`);
        break;
      }
      case MutationTypes.PLANESWALK: {
        const payload = mutation.payload as Payload.Planeswalk;
        const message = `<b>${name(payload?.passivity?.initiator)}</b> ` +
          (state.map?.active[0].type === 'plane' ? 'planeswalked to ' : 'encountered ') +
          `<b>${state.map?.active[0].name}</b>`;
        store.state.feed.push(message);
        break;
      }
      case MutationTypes.CUSTOM_PLANESWALK: {
        const payload = mutation.payload as Payload.CustomPlaneswalk;
        const message = `<b>${name(payload?.passivity?.initiator)}</b> planeswalked to ` +
          `<b>${state.map?.active.map(c => c.name).join('</b> and <b>')}</b>`;
        store.state.feed.push(message);
        break;
      }
      case MutationTypes.CHAOS: {
        const payload = mutation.payload as Payload.Chaos;
        store.state.feed.push(`<b>${name(payload?.passivity?.initiator)}</b> triggered <b>Chaos</b>`);
        break;
      }
      case MutationTypes.COUNTERS: {
        const payload = mutation.payload as Payload.Counters;
        const plane = state.map.active.find(c => c.id === payload.planeId) as Plane;
        const message = `<b>${name(payload?.initiator)}</b> ` +
          `${payload.change > 0 ? 'added ' : 'removed '} <b>${Math.abs(payload.change)}</b> counter on ` +
          `<b>${plane.name}</b> (<b>${plane.counter?.value}</b>)`;
        store.state.feed.push(message);
        break;
      }
      case MutationTypes.RESOLVE_REVEAL: {
        const payload = mutation.payload as Payload.ResolveReveal;
        if (payload.top.length > 0 ) {
          store.state.feed.push(
            `<b>${name(payload?.initiator)}</b> putted on top ` +
            `<b>${payload.top.map(c => c.name).join('</b>, <b>')}</b>`,
          );
        }
        if (payload.bottom.length > 0) {
          store.state.feed.push(
            `<b>${name(payload?.initiator)}</b> putted at the bottom ` +
            `<b>${payload.bottom.map(c => c.name).join('</b>, <b>')}</b>`,
          );
        }
        break;
      }
    }
  };
}

export function createFeeder() {
  return (store: Store) => {
    store.subscribe(handler(store));
  };
};
