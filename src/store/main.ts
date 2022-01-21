import Container from 'typedi';
import { defineStore } from 'pinia';

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
  versionBuffer?: Exported;
};

function getState(): State {
  return {
    map: new EmptyMap(),
    feed: [],
    online: false,
    mates: new Map(),
    wasShuffled: false,
    versionBuffer: undefined,
  };
}

function requestIfOnline(
  state: State,
  method: string,
  payload: Payload.Requestable,
): void {
  if (state.online && !payload.initiator) {
    if (state.wasShuffled) {
      (state.map as OnlineInterface).requestShuffling();
      state.wasShuffled = false;
    } else {
      (state.map as { [method: string]: any })[method](payload);
    }
  }
}

export namespace Payload {
  export type Requestable = { initiator?: string };

  export type Hey = { id: string, name: string };
  export type Bye = { id: string };

  export type Planeswalk = Requestable & ActPayload.Planeswalk;
  export type CustomPlaneswalk = Planeswalk & ActPayload.CustomPlaneswalk;
  export type Encounter = Requestable & ActPayload.Encounter;
  export type Counters = Requestable & ActPayload.Counters;
  export type UpdateWallState = Requestable & ActPayload.UpdateWallState;
  export type Reveal = Requestable & ActPayload.Reveal;
  export type ResolveReveal = Requestable & ActPayload.ResolveReveal;
  export type Undo = Requestable & ActPayload.Undo;
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
    getPlayerName(id?: string): string {
      return id
        ? this.mates.get(id) ?? 'Fblthp'
        : 'You';
    },

    hey(payload: Payload.Hey): void {
      this.mates.set(payload.id, payload.name);
    },
    bye(payload: Payload.Bye): void {
      this.mates.delete(payload.id);
    },

    async init(payload: BuildProps) {
      this.leave();

      this.map = Container.get(MapFactory).build(payload);
      this.online = payload.online;

      await this.map.ready;

      if (payload.online) {
        await (this.map as OnlineInterface).create();
      }
    },

    async join(payload: ActPayload.Join) {
      this.leave();

      this.map = Container.get(MapFactory).build({
        type: MapType.EMPTY,
        online: true,
        advanced: { name: payload.name },
      });
      this.online = true;

      await this.map.ready;
      await (this.map as OnlineInterface).join(payload.roomId);
    },

    leave(): void {
      if (this.online) {
        (this.map as OnlineInterface).leave();
      }
      this.$reset();
      eventBus.all.clear();
    },

    undo(payload: Payload.Undo): void {
      this.map.applyUndo(payload.version);
      this.versionBuffer = undefined;
      requestIfOnline(this.$state, 'requestUndo', payload);
    },

    shuffle(payload: Exported): void {
      this.map.applyShuffle(payload);
    },

    startGame(payload: Payload.Requestable = {}): void {
      this.map.hasStarted = true;
      requestIfOnline(this.$state, 'requestStartGame', payload);
    },

    chaos(payload: Payload.Requestable = {}): void {
      this.map.chaos(payload.initiator);
      requestIfOnline(this.$state, 'requestChaos', payload);
    },
    planeswalk(payload: Payload.Planeswalk = {}): void {
      this.wasShuffled = this.map.planeswalk(payload.coords, payload.initiator);
      requestIfOnline(this.$state, 'requestPlaneswalk', payload);
    },
    customPlaneswalk(payload: Payload.CustomPlaneswalk) {
      this.map.customPlaneswalk(payload.planes);
      requestIfOnline(this.$state, 'requestCustomPlaneswalk', payload);
    },
    encounter(payload: Payload.Encounter) {
      this.map.encounter(payload.coords, payload.initiator);
      requestIfOnline(this.$state, 'requestEncounter', payload);
    },
    resolve(payload: Payload.Requestable = {}) {
      this.map.resolve(payload.initiator);
      requestIfOnline(this.$state, 'requestResolve', payload);
    },
    updateCounters(payload: Payload.Counters) {
      this.map.updateCounter(payload.planeId, payload.change);
      requestIfOnline(this.$state, 'requestCounterUpdate', payload);
    },
    updateWallState(payload: Payload.UpdateWallState) {
      console.log(payload);
      this.map.walls.apply(payload.key, payload.op, payload.val);
      requestIfOnline(this.$state, 'requestUpdateWallState', payload);
    },
    reveal(payload: Payload.Reveal) {
      this.wasShuffled = this.map.revealUntil(payload.count, payload.type);
      requestIfOnline(this.$state, 'requestReveal', payload);
    },
    resolveReveal(payload: Payload.ResolveReveal) {
      console.log(payload);
      this.map.resolveReveal(payload.top, payload.bottom);
      requestIfOnline(this.$state, 'requestResolveReveal', payload);
    },
  },
});
