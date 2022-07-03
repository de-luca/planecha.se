import Container from 'typedi';
import { defineStore } from 'pinia';

import {
  BuildProps,
  EmptyMap,
  MapFactory,
  MapInterface,
  Patch,
  PlaneswalkInput,
  ResolveRevealInput,
  RevealUntilInput,
  UpdateCounterInput,
} from '@/model/map';
import { eventBus } from '@/services/EventBus';
import { useVersion } from './version';
import { Bridge, BridgeInterface } from '@/model/net/Bridge';
import { ApplyInput } from '@/model/wall';
import { DualDeck, EncounterInput } from '@/model/map/eternities';

export interface HeyPayload {
  id: string;
  name: string;
}

export interface ByePayload {
  id: string;
}

export interface JoinPayload {
  roomId: string;
  name: string;
}

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

export const useMain = defineStore('main', {
  state: getState,

  getters: {
    playerName(state: State): string {
      return state.bridge?.getPlayerName() ?? 'You';
    },
    gameId(state: State): string {
      return state.bridge?.getGameId() ?? 'N/A';
    },
  },

  actions: {
    getMateName(id?: string): string {
      return id
        ? this.mates.get(id) ?? 'Fblthp'
        : 'You';
    },

    hey(payload: HeyPayload): void {
      this.mates.set(payload.id, payload.name);
    },
    bye(payload: ByePayload): void {
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

    async join(payload: JoinPayload) {
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

    apply(patch: Patch): void {
      this.map.apply(patch);
      useVersion().applyPatch(patch);
    },

    undo(): void {
      // this.map.applyUndo(payload.version);
      // this.versionBuffer = undefined;
      // requestIfOnline(this.$state, 'requestUndo', payload);
    },

    startGame(): void {
      this.map.hasStarted = true;
    },

    chaos(): void {
      this.map.chaos({ initiator: this.playerName });
    },
    planeswalk(payload: Omit<PlaneswalkInput, 'initiator'>): void {
      this.map.planeswalk({ ...payload, initiator: this.playerName });
    },
    resolve() {
      this.map.resolve({ initiator: this.playerName });
    },
    updateCounters(payload: UpdateCounterInput) {
      this.map.updateCounter(payload);
    },
    reveal(payload: RevealUntilInput) {
      this.map.revealUntil(payload);
    },
    resolveReveal(payload: ResolveRevealInput) {
      this.map.resolveReveal(payload);
    },

    updateWallState(payload: ApplyInput) {
      this.map.walls.apply(payload);
    },

    encounter(payload: Omit<EncounterInput, 'initiator'>) {
      if (this.map instanceof DualDeck) {
        this.map.encounter({ ...payload, initiator: this.playerName });
      }
    },
  },
});
