import Container from 'typedi';
import { defineStore } from 'pinia'

import {
  BuildProps,
  EmptyMap,
  Exported,
  MapFactory,
  MapInterface,
  MapType,
} from '@/model/map';
import { OnlineInterface } from '@/model/net/OnlineInterface';
import { eventBus } from '@/services/EventBus';
import * as ActPayload from '@/model/net/payloads';

export type State = {
  map: MapInterface | MapInterface & OnlineInterface;
  feed: Array<string>;
  online: boolean;
  mates: Map<string, string>;
  wasShuffled: boolean;
};

function getState(): State {
  return {
    map: new EmptyMap(),
    feed: [],
    online: false,
    mates: new Map(),
    wasShuffled: false,
  };
}

function requestIfOnline(
  state: State,
  method: string,
  payload: Payload.Passiveable,
): void {
  if (state.online && !payload.passivity) {
    if (state.wasShuffled) {
      (state.map as OnlineInterface).requestShuffling();
      state.wasShuffled = false;
    } else {
      (state.map as { [method: string]: any })[method](payload);
    }
  }
}

export namespace Payload {
  export type Passiveable = { passivity?: Passivity };

  export type Hey = { id: string, name: string };
  export type Bye = { id: string };

  export type Planeswalk = Passiveable & ActPayload.Planeswalk;
  export type CustomPlaneswalk = Planeswalk & ActPayload.CustomPlaneswalk;
  export type Encounter = Passiveable & ActPayload.Encounter;
  export type Counters = Passiveable & ActPayload.Counters;
  export type UpdateState = Passiveable & ActPayload.UpdateState;
  export type Reveal = Passiveable & ActPayload.Reveal;
  export type ResolveReveal = Passiveable & ActPayload.ResolveReveal;
}

export const useMain = defineStore('main', {
  state: getState,

  getters: {
    yourName(state: State): string {
      return (state.map as OnlineInterface).yourName;
    },
    gameId(state: State): string {
      return (state.map as OnlineInterface).gameId;
    },
  },

  actions: {
    hey(payload: Payload.Hey): void {
      this.mates.set(payload.id, payload.name);
    },
    bye(payload: Payload.Bye): void {
      this.mates.delete(payload.id);
    },

    async init(payload: BuildProps) {
      try {
        this.map = Container.get(MapFactory).build(payload);
        this.online = payload.online;

        await this.map.ready;

        if (payload.online) {
          await (this.map as OnlineInterface).create();
        }
      } catch (err) {
        console.error(err);
      }
    },

    async join(payload: ActPayload.Join) {
      try {
        this.map = Container.get(MapFactory).build({
          type: MapType.EMPTY,
          online: true,
          advanced: { name: payload.name },
        });
        this.online = true;

        await this.map.ready;
        await (this.map as OnlineInterface).join(payload.roomId);
      } catch (err) {
        // some error handling logic
      }
    },
    leave(): void {
      if (this.online) {
        (this.map as OnlineInterface).leave();
      }
      this.$reset();
      eventBus.off('*');
    },

    shuffle(payload: Exported) {
      this.map.applyShuffle(payload);
    },

    startGame(payload: Payload.Passiveable = {}) {
      this.map.hasStarted = true;
      requestIfOnline(this.$state, 'requestStartGame', payload);
    },

    chaos(payload: Payload.Passiveable = {}): void {
      this.map.chaos();
      requestIfOnline(this.$state, 'requestChaos', payload);
    },
    planeswalk(payload: Payload.Planeswalk = {}): void {
      this.wasShuffled = this.map.planeswalk(
        payload.coords,
        payload.passivity,
      );
      requestIfOnline(this.$state, 'requestPlaneswalk', payload);
    },
    customPlaneswalk(payload: Payload.CustomPlaneswalk) {
      console.log(payload);
      this.map.customPlaneswalk(payload.planes);
      requestIfOnline(this.$state, 'requestCustomPlaneswalk', payload);
    },
    encounter(payload: Payload.Encounter) {
      this.map.encounter(payload.coords, payload.passivity);
      requestIfOnline(this.$state, 'requestEncounter', payload);
    },
    resolve(payload: Payload.Passiveable = {}) {
      this.map.resolve(payload.passivity);
      requestIfOnline(this.$state, 'requestResolve', payload);
    },
    updateCounters(payload: Payload.Counters) {
      this.map.updateCounter(payload.planeId, payload.change);
      requestIfOnline(this.$state, 'requestCounterUpdate', payload);
    },
    updateState(payload: Payload.UpdateState) {
      this.map.states.apply(payload.key, payload.op, payload.val);
      requestIfOnline(this.$state, 'requestUpdateState', payload);
    },
    reveal(payload: Payload.Reveal) {
      this.wasShuffled = this.map.revealUntil(payload.count, payload.type);
      requestIfOnline(this.$state, 'requestReveal', payload);
    },
    resolveReveal(payload: Payload.ResolveReveal) {
      this.map.resolveReveal(payload.top, payload.bottom);
      requestIfOnline(this.$state, 'requestResolveReveal', payload);
    },
  }
});
