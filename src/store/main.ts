import Container from 'typedi';
import { defineStore } from 'pinia';

import {
  BuildProps,
  EmptyMap,
  Exported,
  MapFactory,
  MapInterface,
  MapType,
  Patch,
} from '@/model/map';
import { eventBus } from '@/services/EventBus';
import * as ActPayload from '@/model/net/payloads';
import { useVersion } from './version';
import { Bridge, BridgeInterface } from '@/model/net/Bridge';

export interface State {
  online: boolean;
  map: MapInterface;
  bridge?: BridgeInterface;
  mates: Map<string, string>;
  feed: Array<string>;
};

function getState(): State {
  return {
    online: false,
    map: new EmptyMap(),
    bridge: undefined,
    mates: new Map(),
    feed: [],
  };
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
      return state.bridge?.getPlayerName() ?? 'You';
    },
    gameId(state: State): string {
      return state.bridge?.getGameId() ?? 'N/A';
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

      if (payload.online) {
        this.bridge = new Bridge(payload.advanced.name as string);
        await this.bridge.ready;
        await this.bridge.create();
      }
    },

    async join(payload: ActPayload.Join) {
      this.leave();
      this.online = true;
      this.bridge = new Bridge(payload.name);
      await this.bridge.ready;
      this.map = await this.bridge.join(payload.roomId);
    },

    leave(): void {
      this.bridge?.leave();
      this.$reset();
      eventBus.all.clear();
      useVersion().$reset();
    },

    sync(patch: Patch): void {
      this.bridge?.sync(patch);
    },

    apply(payload: Patch): void {
      this.map.apply(payload);
      useVersion().applyPatch(payload);
    },

    undo(payload: Payload.Undo): void {
      // this.map.applyUndo(payload.version);
      // this.versionBuffer = undefined;
      // requestIfOnline(this.$state, 'requestUndo', payload);
    },

    // TODO: REMOVE
    shuffle(payload: Exported): void {
      // this.map.applyShuffle(payload);
    },

    startGame(payload: Payload.Requestable = {}): void {
      this.map.hasStarted = true;
      // requestIfOnline(this.$state, 'requestStartGame', payload);
    },

    chaos(payload: Payload.Requestable = {}): void {
      this.map.chaos(payload.initiator);
      // requestIfOnline(this.$state, 'requestChaos', payload);
    },
    planeswalk(payload: Payload.Planeswalk = {}): void {
      this.map.planeswalk(payload.coords, payload.initiator);
      // requestIfOnline(this.$state, 'requestPlaneswalk', payload);
    },
    // TODO: Merge with planeswalk
    customPlaneswalk(payload: Payload.CustomPlaneswalk) {
      this.map.customPlaneswalk(payload.planes);
      // requestIfOnline(this.$state, 'requestCustomPlaneswalk', payload);
    },
    encounter(payload: Payload.Encounter) {
      this.map.encounter(payload.coords, payload.initiator);
      // requestIfOnline(this.$state, 'requestEncounter', payload);
    },
    resolve(payload: Payload.Requestable = {}) {
      this.map.resolve(payload.initiator);
      // requestIfOnline(this.$state, 'requestResolve', payload);
    },
    updateCounters(payload: Payload.Counters) {
      this.map.updateCounter(payload.planeId, payload.change);
      // requestIfOnline(this.$state, 'requestCounterUpdate', payload);
    },
    updateWallState(payload: Payload.UpdateWallState) {
      this.map.walls.apply(payload.key, payload.op, payload.val);
      // requestIfOnline(this.$state, 'requestUpdateWallState', payload);
    },
    reveal(payload: Payload.Reveal) {
      this.map.revealUntil(payload.count, payload.type);
      // requestIfOnline(this.$state, 'requestReveal', payload);
    },
    resolveReveal(payload: Payload.ResolveReveal) {
      this.map.resolveReveal(payload.top, payload.bottom);
      // requestIfOnline(this.$state, 'requestResolveReveal', payload);
    },
  },
});
