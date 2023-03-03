import { defineStore } from 'pinia';

import {
  BuildProps,
  ChaosInput,
  Exported,
  MapFactory,
  MapInterface,
  PlaneswalkInput,
  ResolveRevealInput,
  RevealUntilInput,
  UpdateCounterInput,
} from '#/model/map';
import { eventBus } from '#/services/EventBus';
import { ApplyInput } from '#/model/wall';
import { DualDeck, EncounterInput } from '#/model/map/eternities';
import { Phenomenon, Plane } from '#/model/card';
import { Clone, Patch, Repo, RepoInterface } from '#/model/ver';
import { Game, GameInterface } from '#/model/net/Game';
import { SavedDeck } from '#/components/create/types';

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

export interface InitPayload {
  mapConfig: BuildProps;
  repo: Clone;
  map: Exported;
  feed: Array<string>;
}

export interface State {
  _map?: MapInterface;
  _mapConf?: BuildProps;
  repo: RepoInterface;
  feed: Array<string>;
  opStack: Array<OpRequest>;

  mates: Map<string, string>;
  game?: GameInterface;

  selfName: string | null;
  theme: Theme;
  decks: Map<string, SavedDeck>;
}

function getState(): State {
  const serializedDecks = localStorage.getItem('decks');

  return {
    _map: undefined,
    _mapConf: undefined,

    repo: new Repo(),
    feed: [],
    opStack: [],

    mates: new Map(),
    game: undefined,

    selfName: localStorage.getItem('selfName'),
    theme: localStorage.getItem('theme') as Theme ?? 'sys',
    decks: serializedDecks !== null
      ? new Map(JSON.parse(serializedDecks) as Array<[string, SavedDeck]>)
      : new Map(),
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
    mapConf(): BuildProps {
      if (!this._mapConf) {
        throw new Error('Map is undefined (store is in unset state)');
      }
      return this._mapConf;
    },
    logName(): string {
      return this.game ? this.selfName! : 'You';
    },
    gameId(): string | undefined {
      return this.game?.gameId;
    },
    initPayload(): InitPayload {
      return {
        mapConfig: this.mapConf,
        repo: this.repo.clone(),
        map: this.map.export(),
        feed: [...this.feed],
      };
    },
  },

  actions: {
    setTheme(theme: Theme): void {
      this.theme = theme;
      localStorage.setItem('theme', this.theme);
    },
    setName(name: string): void {
      this.selfName = name;
      localStorage.setItem('selfName', this.selfName);
      this.game?.hey({ name: this.selfName });
    },
    addDeck(name: string, deck: SavedDeck): void {
      this.decks.set(name, deck);
      localStorage.setItem(
        'decks',
        JSON.stringify(Array.from(this.decks.entries())),
      );
    },
    removeDeck(name: string): void {
      this.decks.delete(name);
      localStorage.setItem(
        'decks',
        JSON.stringify(Array.from(this.decks.entries())),
      );
    },

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
      this._mapConf = payload;
      this._map = MapFactory.build(payload);
    },

    open() {
      this.game = new Game(this);
    },

    async join(payload: JoinPayload) {
      this.leave();
      this.selfName = payload.name;
      this.game = new Game(this, payload.roomId);
      try {
        await this.game.joined;
      } catch(e) {
        console.dir(e);
      }

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
    },
    undo(): void {
      const index = this.repo.getStableIndex();
      this.applyUndo(index);
      this.game?.undo(index);
    },
    applyUndo(index: number): void {
      this.map.restore(this.repo.checkout(index));
    },
    reset(): void {
      this._map = MapFactory.build(this.mapConf);
      this.repo = new Repo();
      this.feed = [];
      this.game?.reset(this.initPayload);
    },
    applyReset(payload: InitPayload): void {
      this._mapConf = payload.mapConfig;
      this._map = MapFactory.restore(payload.map);
      this.repo = new Repo(payload.repo);
      this.feed = payload.feed;
    },

    startGame(): void {
      this.map.start();
    },

    chaos(payload: Omit<ChaosInput, 'initiator'>): void {
      this.map.chaos({ ...payload, initiator: this.logName });
      if (
          payload.card instanceof Phenomenon ||
          (payload.card instanceof Plane && !payload.card.chaosRequireInterraction)
      ) {
        this.resolveOpStack();
      }
    },
    planeswalk(payload: Omit<PlaneswalkInput, 'initiator'>): void {
      this.map.planeswalk({ ...payload, initiator: this.logName });
    },
    resolve() {
      this.map.resolve({ initiator: this.logName });
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
        this.map.encounter({ ...payload, initiator: this.logName });
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

    rollDice(sides: number): DiceResult {
      return Math.floor(Math.random() * sides) + 1;
    },
    rollPlanarDice(): PlanarDiceResult {
      const rolled = Math.floor(Math.random() * 6) + 1;
      return rolled === 1
        ? 'CHAOS'
        : rolled === 6 ? 'PLANESWALK' : 'NO_EFFECT';
    },
    flipCoin(): CoinFlipResult  {
      return Boolean(Math.round(Math.random())) ? 'HEADS' : 'TAILS';
    },
  },
});
