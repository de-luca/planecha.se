import { Container } from 'typedi';
import { defineStore } from 'pinia';

import {
  BuildProps,
  ChaosInput,
  MapFactory,
  MapInterface,
  PlaneswalkInput,
  ResolveRevealInput,
  RevealUntilInput,
  UpdateCounterInput,
} from '@/model/map';
import { eventBus } from '@/services/EventBus';
import { Bridge, BridgeInterface } from '@/model/net/Bridge';
import { ApplyInput } from '@/model/wall';
import { DualDeck, EncounterInput } from '@/model/map/eternities';
import { Phenomenon, Plane } from '@/model/card';
import { Patch, Repo, RepoInterface } from '@/model/ver';

export enum Op {
  CHAOS = 'chaos',
  RESOLVE_REVEAL = 'resolveReveal',
}

export interface OpRequest {
  op: Op;
  payload?: unknown;
}


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
  _map?: MapInterface;
  online: boolean;
  repo: RepoInterface;
  bridge?: BridgeInterface;
  mates: Map<string, string>;
  feed: Array<string>;
  opStack: Array<OpRequest>;
}

function getState(): State {
  return {
    _map: undefined,
    online: false,
    repo: new Repo(),
    bridge: undefined,
    mates: new Map(),
    feed: [],
    opStack: [],
  };
}

export const useMain = defineStore('main', {
  state: getState,

  getters: {
    map(): MapInterface {
      if (!this._map) {
        throw new Error('Map is undefined (store is in unset state)');
      }
      return this._map;
    },
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

      this._map = Container.get(MapFactory).build(payload);
      this.online = payload.online;

      if (payload.online) {
        this.bridge = new Bridge(payload.advanced.name as string, this);
        await this.bridge.ready;
        await this.bridge.create();
      }
    },

    async join(payload: JoinPayload) {
      this.leave();
      this.online = true;
      this.bridge = new Bridge(payload.name, this);
      await this.bridge.ready;
      const [map, repo, feed] = await this.bridge.join(payload.roomId);
      this._map = map;
      this.repo = repo;
      this.feed = feed;
    },

    leave(): void {
      this.bridge?.leave();
      this.$reset();
      eventBus.all.clear();
    },

    pushToFeed(log: string): void {
      this.feed.push(log);
      this.bridge?.syncFeed(log);
    },

    sync(patch: Patch): void {
      this.bridge?.sync(patch);
    },
    apply(patch: Patch): void {
      this.map.apply(patch);
      this.repo.apply(patch);
      this.repo.setStash(this.map.export());
    },
    revert(index: number): void {
      this.applyRevert(index);
      this.bridge?.revert(index);
    },
    applyRevert(index: number): void {
      this.map.restore(this.repo.checkout(index));
      this.repo.setStash(this.map.export());
    },

    startGame(): void {
      this.map.start();
    },

    chaos(payload: Omit<ChaosInput, 'initiator'>): void {
      this.map.chaos({ ...payload, initiator: this.playerName });
      if (
          payload.card instanceof Phenomenon ||
          (payload.card instanceof Plane && !payload.card.chaosRequireInterraction)
      ) {
        this.resolveOpStack();
      }
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
      this.resolveOpStack();
    },

    updateWallState(payload: ApplyInput) {
      this.map.wallStates.apply(payload);
    },

    encounter(payload: Omit<EncounterInput, 'initiator'>) {
      if (this.map instanceof DualDeck) {
        this.map.encounter({ ...payload, initiator: this.playerName });
      }
    },

    pushOpToStack(op: Op, payload: unknown) {
      this.opStack.push({ op, payload });
    },
    resolveOpStack() {
      const opr = this.opStack.pop();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      opr && this[opr.op](opr.payload);
    },
  },
});
