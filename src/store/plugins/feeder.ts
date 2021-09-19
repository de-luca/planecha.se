import { MutationPayload } from 'vuex';
import { BuildProps } from '@/model/map';
import { Plane } from '@/model/card';
import {
  MutationTypes,
  State,
  Store,
} from '..';
import { Payload } from '../states/map';

const chaos = '<abbr class="symbol chaos" title="chaos">{CHAOS}</abbr>';
const plnwlk = '<abbr class="symbol planeswalk" title="planeswalk">{CHAOS}</abbr>';

function name(state: State, id?: string): string {
  if (id) {
    return state.mates.get(id) as string;
  }
  return 'You';
}

function handler(mutation: MutationPayload, state: State): void {
  switch (mutation.type) {
    case MutationTypes.INIT: {
      const payload = mutation.payload as BuildProps;
      const type = payload.type === 'classic'
        ? 'Classic'
        : 'Eternities Map';
      state.feed.push(`<b>You</b> created new game <b>${type}</b>`);
      break;
    }
    case MutationTypes.START_GAME: {
      state.feed.push(`Game starts on <b>${state.map.active[0].name}</b>`);
      break;
    }
    case MutationTypes.HEY: {
      const payload = mutation.payload as Payload.Hey;
      state.feed.push(`<b>${payload.name}</b> joined game`);
      break;
    }
    case MutationTypes.PLANESWALK: {
      const payload = mutation.payload as Payload.Planeswalk;
      const message = `<b>${name(state, payload?.passivity?.initiator)}</b> ` +
        (state.map?.active[0].type === 'plane' ? `${plnwlk} to` : 'encountered') +
        ` <b>${state.map?.active[0].name}</b>`;
      state.feed.push(message);
      break;
    }
    case MutationTypes.CUSTOM_PLANESWALK: {
      const payload = mutation.payload as Payload.CustomPlaneswalk;
      const message = `<b>${name(state, payload?.passivity?.initiator)}</b> ${plnwlk} to ` +
        `<b>${state.map?.active.map(c => c.name).join('</b> and <b>')}</b>`;
      state.feed.push(message);
      break;
    }
    case MutationTypes.CHAOS: {
      const payload = mutation.payload as Payload.Chaos;
      const message = `<b>${name(state, payload?.passivity?.initiator)}</b> triggered ${chaos} ` +
        `on <b>${state.map?.active.map(c => c.name).join('</b> and <b>')}</b>`;
      state.feed.push(message);
      break;
    }
    case MutationTypes.COUNTERS: {
      const payload = mutation.payload as Payload.Counters;
      const plane = state.map.active.find(c => c.id === payload.planeId) as Plane;
      const message = `<b>${name(state, payload?.initiator)}</b> ` +
        `${payload.change > 0 ? 'added ' : 'removed '} <b>${Math.abs(payload.change)}</b> `+
        `(<b>${plane.counter?.value}</b>) counter on ` +
        `<b>${plane.name}</b>`;
      state.feed.push(message);
      break;
    }
    case MutationTypes.RESOLVE_REVEAL: {
      const payload = mutation.payload as Payload.ResolveReveal;
      if (payload.top.length > 0 ) {
        state.feed.push(
          `<b>${name(state, payload?.initiator)}</b> putted on top ` +
          `<b>${payload.top.map(c => c.name).join('</b>, <b>')}</b>`,
        );
      }
      if (payload.bottom.length > 0) {
        state.feed.push(
          `<b>${name(state, payload?.initiator)}</b> putted at the bottom ` +
          `<b>${payload.bottom.map(c => c.name).join('</b>, <b>')}</b>`,
        );
      }
      break;
    }
  }
}

export function createFeeder() {
  return (store: Store) => store.subscribe(handler);
};
