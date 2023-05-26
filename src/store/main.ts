import { defineStore } from 'pinia';

import {
  BuildProps,
  ChaosInput,
  Exported,
  MapFactory,
  MapInterface,
  MapType,
  PlaneswalkInput,
  ResolveRevealInput,
  RevealUntilInput,
  UpdateCounterInput,
} from '#/model/map';
import { eventBus } from '#/services/EventBus';
import { ApplyInput } from '#/model/wall';
import { DualDeck, EncounterInput } from '#/model/map/eternities';
import { Phenomenon, Plane } from '#/model/card';
import { Clone, MaybeExported, RepoFactory, RepoInterface } from '#/model/ver';
import { Net, NetInterface } from '#/model/net/Net';
import { once, resolveAfter } from '#/utils/invoke';
import { Patch, diff } from '#/utils/delta';
import { SavedDeck } from '#/components/create/utils';

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

export interface PreflightPayload {
  mapType: MapType;
  hasStarted: boolean;
  players: Array<string>;
}

export interface State {
  _config?: BuildProps;

  _map?: MapInterface;
  _repo?: RepoInterface;
  net?: NetInterface;

  feed: Array<string>;
  opStack: Array<OpRequest>;

  mates: Map<string, string>;
  selfName: string | null;
  theme: Theme;
  decks: Map<string, SavedDeck>;
}

function getState(): State {
  const serializedDecks = localStorage.getItem('decks');

  return {
    _config: undefined,

    _map: undefined,
    _repo: undefined,
    net: undefined,

    feed: [],
    opStack: [],

    mates: new Map(),

    selfName: localStorage.getItem('selfName'),
    theme: localStorage.getItem('theme') as Theme ?? 'sys',
    decks: serializedDecks !== null
      ? new Map(JSON.parse(serializedDecks) as Array<[string, SavedDeck]>)
      : new Map(),
  };
}

export type MainStore = ReturnType<typeof useMain>;
export type MainStoreState = Omit<MainStore, keyof ReturnType<typeof defineStore>>;

export const useMain = defineStore('main', {
  state: getState,

  getters: {
    config(): BuildProps {
      if (this._config) return this._config;
      throw new Error('Config is undefined (store is in unset state)');

    },
    map(): MapInterface {
      if (this._map) return this._map;
      throw new Error('Map is undefined (store is in unset state)');
    },
    repo(): RepoInterface {
      if (this._repo) return this._repo;
      throw new Error('Repo is undefined (store is in unset state)');
    },
    logName(): string {
      return this.net ? this.selfName! : 'You';
    },
    gameId(): string | undefined {
      return this.net?.gameId;
    },
    isMulti(): boolean {
      return this._config?.type === MapType.MULTI;
    },
    initPayload(): InitPayload {
      return {
        mapConfig: this.config,
        repo: this.repo.clone(),
        map: this.map.export(),
        feed: [...this.feed],
      };
    },
    gameStatus(): PreflightPayload {
      return {
        mapType: this.config.type,
        hasStarted: this.map.hasStarted,
        players: [
          this.selfName!,
          ...this.mates.values(),
        ],
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
      this.net?.hey({ name: this.selfName });
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

    init(payload: BuildProps) {
      this.leave();
      this._config = payload;
      this._map = MapFactory.build(payload);
      this._repo = RepoFactory.build(payload);
    },

    open() {
      this.net = new Net(this);
      if (this.isMulti) {
        this.net.setInitHandler((store) => (data, peer) =>
          store.apply({ event: '__init__', delta: diff<MaybeExported>({}, data.map) }, peer),
        );
      }
    },

    preJoin(roomId: string) {
      this.leave();
      this.net = new Net(this, roomId);
      return this.net.connected;
    },
    join(payload: BuildProps) {
      if (payload.type !== MapType.MULTI) {
        return this.net!.join(({ store, done }) => once((data) => {
          store.applyReset(data);
          done();
        }));
      }

      this._config = payload;
      this._map = MapFactory.build(payload);
      this._repo = RepoFactory.build(payload);

      return this.net!.join(({ store, done }) =>
        resolveAfter(
          (data, peer) =>
            store.apply({ event: '__init__', delta: diff<MaybeExported>({}, data.map)}, peer),
          this.net!.peerCount,
          (data) => {
            this.feed = data.feed;
            this.net!.setInitHandler((store) => (data, peer) =>
              store.apply({ event: '__init__', delta: diff<MaybeExported>({}, data.map) }, peer),
            );
            done();
          },
        ),
      );
    },

    leave(): void {
      this.net?.leave();
      this.$reset();
      eventBus.all.clear();
    },

    pushToFeed(log: string): void {
      this.feed.push(log);
      this.net?.syncFeed(log);
    },

    sync(patch: Patch): void {
      this.net?.sync(patch);
    },
    apply(patch: Patch, peer: string): void {
      this.map.apply(patch, peer);
      this.repo.apply(patch);
    },
    undo(): void {
      const index = this.repo.getStableIndex();

      if (!this.isMulti) {
        this.applyUndo(index);
        this.net?.undo(index);
        return;
      }

      const base = { ...this.map.dump(), deck: { cards: [], played: [] } };
      this.applyUndo(index);
      this.net?.sync({
        event: '__undo__',
        delta: diff(base, {
          ...this.map.dump(),
          deck: { cards: [], played: [] },
        }),
      });
    },
    applyUndo(index: number): void {
      this.map.restore(this.repo.checkout(index));
    },
    reset(): void {
      this._map = MapFactory.build(this.config);
      this._repo = RepoFactory.build(this.config);
      this.feed = [];
      this.net?.reset(this.initPayload);

      if (this.isMulti) {
        this.net?.init(this.initPayload);
      }
    },
    applyReset(payload: InitPayload): void {
      this.feed = payload.feed;

      if (this.isMulti) {
        this._map = MapFactory.build(this.config);
        this._repo = RepoFactory.build(this.config);
        this.net?.init(this.initPayload);
        return;
      }

      this._config = payload.mapConfig;
      this._map = MapFactory.restore(payload.map);
      this._repo = RepoFactory.restore(payload);
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
