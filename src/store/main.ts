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
import { ApplyInput } from '@/model/wall';
import { DualDeck, EncounterInput } from '@/model/map/eternities';
import { Phenomenon, Plane } from '@/model/card';
import { Patch, Repo, RepoInterface } from '@/model/ver';
import { Game, GameInterface } from '@/model/net/Game';

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
  repo: RepoInterface;
  feed: Array<string>;
  opStack: Array<OpRequest>;
  selfName: string;
  mates: Map<string, string>;
  game?: GameInterface;
}

function getState(): State {
  return {
    _map: undefined,
    repo: new Repo(),
    feed: [],
    opStack: [],
    selfName: 'You',
    mates: new Map(),
    game: undefined,
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
    gameId(state: State): string | undefined {
      return state.game?.gameId;
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
      if (payload.online) {
        this.selfName = payload.advanced.name!;
        this.game = new Game(this);
      }
    },

    async join(payload: JoinPayload) {
      this.leave();
      this.selfName = payload.name;
      this.game = new Game(this, payload.roomId);
      await this.game.joined;
    },

    leave(): void {
      this.game?.leave();
      this.$reset();
      eventBus.all.clear();
    },

    pushToFeed(log: string): void {
      this.feed.push(log);
      this.game?.syncFeed(log);
    },

    sync(patch: Patch): void {
      this.game?.sync(patch);
    },
    apply(patch: Patch): void {
      this.map.apply(patch);
      this.repo.apply(patch);
      this.repo.setStash(this.map.export());
    },
    revert(index: number): void {
      this.applyRevert(index);
      this.game?.revert(index);
    },
    applyRevert(index: number): void {
      this.map.restore(this.repo.checkout(index));
      this.repo.setStash(this.map.export());
    },

    startGame(): void {
      this.map.start();
    },

    chaos(payload: Omit<ChaosInput, 'initiator'>): void {
      this.map.chaos({ ...payload, initiator: this.selfName });
      if (
          payload.card instanceof Phenomenon ||
          (payload.card instanceof Plane && !payload.card.chaosRequireInterraction)
      ) {
        this.resolveOpStack();
      }
    },
    planeswalk(payload: Omit<PlaneswalkInput, 'initiator'>): void {
      this.map.planeswalk({ ...payload, initiator: this.selfName });
    },
    resolve() {
      this.map.resolve({ initiator: this.selfName });
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
        this.map.encounter({ ...payload, initiator: this.selfName });
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
