import { Container } from 'typedi';
import {
  ActionContext,
  Store as VuexStore,
  CommitOptions,
  DispatchOptions,
  ActionTree,
} from 'vuex';

import {
  BuildProps,
  EmptyMap,
  Exported,
  MapFactory,
  MapInterface,
  MapSpecs,
  MapType,
  Revealed,
  Tile,
} from '@/model/map';
import * as ActPayload from '@/model/net/payloads';
import { OnlineInterface } from '@/model/net/OnlineInterface';
import { Card } from '@/model/card';
import { eventBus } from '@/services/EventBus';


// Declare state
export type State = {
  map: MapInterface | MapInterface & OnlineInterface;

  feed: Array<string>;

  online: boolean;
  mates: Map<string, string>;

  wasShuffled: boolean;
};

function resetState(state: Record<string, unknown>): State {
  state.map = new EmptyMap();
  state.feed = [];
  state.online = false;
  state.mates = new Map();
  state.wasShuffled = false;

  return state as State;
}

// Init state
export const state: State = resetState({});

// mutations enums
export enum MutationTypes {
  LEAVE = 'LEAVE',
  HEY = 'HEY',
  BYE = 'BYE',
  INIT = 'INIT',
  SHUFFLE = 'SHUFFLE',
  CHAOS = 'CHAOS',
  PLANESWALK = 'PLANESWALK',
  CUSTOM_PLANESWALK = 'CUSTOM_PLANESWALK',
  RESOLVE = 'RESOLVE',
  ENCOUNTER = 'ENCOUNTER',
  COUNTERS = 'COUNTERS',
  UPDATE_STATE = 'UPDATE_STATE',
  REVEAL = 'REVEAL',
  RESOLVE_REVEAL = 'RESOLVE_REVEAL',
  START_GAME = 'START_GAME',
}

export namespace Payload {
  export type Idable = { initiator?: string };
  export type Passiveable = { passivity?: Passivity };

  export type Hey = { id: string, name: string };
  export type Bye = { id: string };

  export type Chaos = Passiveable;
  export type Resolve = Passiveable;
  export type Planeswalk = Passiveable & ActPayload.Planeswalk;
  export type CustomPlaneswalk = Planeswalk & ActPayload.CustomPlaneswalk;
  export type Encounter = Passiveable & ActPayload.Encounter;
  export type Counters = Idable & ActPayload.Counters;
  export type UpdateState = ActPayload.UpdateState;
  export type Reveal = ActPayload.Reveal;
  export type ResolveReveal = Idable & ActPayload.ResolveReveal;
}

// Mutation contracts
export type Mutations<S = State> = {
  [MutationTypes.LEAVE](state: S): void,
  [MutationTypes.HEY](state: S, payload: Payload.Hey): void,
  [MutationTypes.BYE](state: S, payload: Payload.Bye): void,
  [MutationTypes.INIT](state: S, payload: BuildProps): void,
  [MutationTypes.SHUFFLE](state: S, payload: Exported): void,
  [MutationTypes.CHAOS](state: S, payload: Payload.Chaos): void,
  [MutationTypes.PLANESWALK](state: S, payload: Payload.Planeswalk): void,
  [MutationTypes.CUSTOM_PLANESWALK](state: S, payload: Payload.CustomPlaneswalk): void,
  [MutationTypes.RESOLVE](state: S, payload: Payload.Resolve): void,
  [MutationTypes.ENCOUNTER](state: S, payload: Payload.Encounter): void,
  [MutationTypes.COUNTERS](state: S, payload: Payload.Counters): void,
  [MutationTypes.UPDATE_STATE](state: S, payload: Payload.UpdateState): void,
  [MutationTypes.REVEAL](state: S, payload: Payload.Reveal): void,
  [MutationTypes.RESOLVE_REVEAL](state: S, payload: Payload.ResolveReveal): void,
  [MutationTypes.START_GAME](state: S): void,
}

// Define mutations
export const mutations: Mutations = {
  [MutationTypes.LEAVE](state: State) {
    if (state.online) {
      (state.map as OnlineInterface).leave();
    }

    resetState(state);
    eventBus.off('*');
  },

  [MutationTypes.HEY](state: State, payload) {
    state.mates.set(payload.id, payload.name);
  },
  [MutationTypes.BYE](state: State, payload) {
    state.mates.delete(payload.id);
  },

  [MutationTypes.INIT](state: State, payload: BuildProps) {
    state.map = Container.get(MapFactory).build(payload);
    state.online = payload.online;
  },

  [MutationTypes.SHUFFLE](state: State, payload: Exported) {
    state.map.applyShuffle(payload);
  },
  [MutationTypes.CHAOS](state: State, payload = {}) {
    state.map.chaos(payload.passivity);
  },
  [MutationTypes.PLANESWALK](state: State, payload = {}) {
    state.wasShuffled = state.map.planeswalk(
      payload.coords,
      payload.passivity,
    );
  },
  [MutationTypes.CUSTOM_PLANESWALK](state: State, payload) {
    state.map.customPlaneswalk(payload.planes);
  },
  [MutationTypes.RESOLVE](state: State, payload = {}) {
    state.map.resolve(payload.passivity);
  },
  [MutationTypes.ENCOUNTER](state: State, payload) {
    state.map.encounter( payload.coords, payload.passivity);
  },
  [MutationTypes.COUNTERS](state: State, payload) {
    state.map.updateCounter(payload.planeId, payload.change);
  },
  [MutationTypes.UPDATE_STATE](state: State, payload) {
    state.map.states.apply(payload.key, payload.op, payload.val);
  },
  [MutationTypes.REVEAL](state: State, payload) {
    state.wasShuffled = state.map.revealUntil(payload.count, payload.type);
  },
  [MutationTypes.RESOLVE_REVEAL](state: State, payload) {
    state.map.resolveReveal(payload.top, payload.bottom);
  },
  [MutationTypes.START_GAME](state: State) {
    state.map.hasStarted = true;
  },
};



// Action enums
export enum ActionTypes {
  INIT = 'INIT',
  JOIN = 'JOIN',
  CHAOS = 'CHAOS',
  PLANESWALK = 'PLANESWALK',
  CUSTOM_PLANESWALK = 'CUSTOM_PLANESWALK',
  RESOLVE = 'RESOLVE',
  ENCOUNTER = 'ENCOUNTER',
  COUNTERS = 'COUNTERS',
  UPDATE_STATE = 'UPDATE_STATE',
  REVEAL = 'REVEAL',
  RESOLVE_REVEAL = 'RESOLVE_REVEAL',
  START_GAME = 'START_GAME',
}

// Actions context
type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload?: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, State>, 'commit'>

// Actions contracts
export interface Actions {
  [ActionTypes.INIT](
    { commit }: AugmentedActionContext,
    payload: BuildProps,
  ): Promise<void>,
  [ActionTypes.JOIN](
    { commit }: AugmentedActionContext,
    payload: ActPayload.Join,
  ): Promise<void>,
  [ActionTypes.CHAOS](
    { commit }: AugmentedActionContext,
  ): void,
  [ActionTypes.PLANESWALK](
    { commit }: AugmentedActionContext,
    payload: ActPayload.Planeswalk,
  ): void,
  [ActionTypes.CUSTOM_PLANESWALK](
    { commit }: AugmentedActionContext,
    payload: ActPayload.CustomPlaneswalk,
  ): void,
  [ActionTypes.RESOLVE](
    { commit }: AugmentedActionContext,
  ): void,
  [ActionTypes.ENCOUNTER](
    { commit }: AugmentedActionContext,
    payload: ActPayload.Encounter,
  ): void,
  [ActionTypes.COUNTERS](
    { commit }: AugmentedActionContext,
    payload: ActPayload.Counters,
  ): void,
  [ActionTypes.UPDATE_STATE](
    { commit }: AugmentedActionContext,
    payload: ActPayload.UpdateState,
  ): void,
  [ActionTypes.REVEAL](
    { commit }: AugmentedActionContext,
    payload: ActPayload.Reveal,
  ): void,
  [ActionTypes.RESOLVE_REVEAL](
    { commit }: AugmentedActionContext,
    payload: ActPayload.ResolveReveal,
  ): void,
  [ActionTypes.START_GAME](
    { commit }: AugmentedActionContext,
  ): void,
}

function requestIfOnline(method: string, payload?: any): void {
  if (state.online) {
    if (state.wasShuffled) {
      (state.map as OnlineInterface).requestShuffling();
      state.wasShuffled = false;
    } else {
      (state.map as { [method: string]: any })[method](payload);
    }
  }
}

// Define actions
export const actions: ActionTree<State, State> & Actions = {
  async [ActionTypes.INIT]({ commit }, payload) {
    try {
      commit(MutationTypes.INIT, payload);
      await state.map.ready;

      if (payload.online) {
        await (state.map as OnlineInterface).create();
      }
    } catch (err) {
      console.error(err);
    }
  },
  async [ActionTypes.JOIN]({ commit }, payload) {
    try {
      commit(MutationTypes.INIT, {
        type: MapType.EMPTY,
        online: true,
        advanced: { name: payload.name },
      });
      await state.map.ready;
      await (state.map as OnlineInterface).join(payload.roomId);
    } catch (err) {
        // some error handling logic
    }
  },

  [ActionTypes.CHAOS]({ commit }) {
    commit(MutationTypes.CHAOS);
    requestIfOnline('requestChaos');
  },
  [ActionTypes.PLANESWALK]({ commit }, payload = {}) {
    commit(MutationTypes.PLANESWALK, payload);
    requestIfOnline('requestPlaneswalk', payload);
  },
  [ActionTypes.CUSTOM_PLANESWALK]({ commit }, payload) {
    commit(MutationTypes.CUSTOM_PLANESWALK, payload);
    requestIfOnline('requestCustomPlaneswalk', payload);
  },
  [ActionTypes.ENCOUNTER]({ commit }, payload) {
    commit(MutationTypes.ENCOUNTER, payload);
    requestIfOnline('requestEncounter', payload);
  },
  [ActionTypes.RESOLVE]({ commit }) {
    commit(MutationTypes.RESOLVE);
    requestIfOnline('requestResolve');
  },
  [ActionTypes.COUNTERS]({ commit }, payload) {
    commit(MutationTypes.COUNTERS, payload);
    requestIfOnline('requestCounterUpdate', payload);
  },
  [ActionTypes.UPDATE_STATE]({ commit }, payload) {
    commit(MutationTypes.UPDATE_STATE, payload);
    requestIfOnline('requestUpdateState', payload);
  },
  [ActionTypes.REVEAL]({ commit }, payload) {
    commit(MutationTypes.REVEAL, payload);
    requestIfOnline('requestReveal', payload);
  },
  [ActionTypes.RESOLVE_REVEAL]({ commit }, payload) {
    commit(MutationTypes.RESOLVE_REVEAL, payload);
    requestIfOnline('requestResolveReveal', payload);
  },
  [ActionTypes.START_GAME]({ commit }) {
    commit(MutationTypes.START_GAME);
    requestIfOnline('requestStartGame');
  },
};

// Getters types
export type Getters = {
  feed(state: State): Array<string>;
  online(state: State): boolean;
  yourName(state: State): string;
  gameId(state: State): string;
  mates(state: State): Map<string, string>;
  map(state: State): MapInterface;
  specs(state: State): MapSpecs;
  active(state: State): Array<Card>;
  played(state: State): Array<Card>;
  remaining(state: State): number;
  revealed(state: State): Revealed | undefined;
  tiles(state: State): Array<Tile>;
}

// Getters
export const getters: Getters = {
  feed: state => state.feed,
  online: state => state.online,
  yourName: state => (state.map as OnlineInterface).yourName,
  gameId: state => (state.map as OnlineInterface).gameId,
  mates: state => state.mates,
  map: state => state.map,
  specs: state => state.map.specs,
  active: state => state.map.active,
  played: state => state.map.played,
  remaining: state => state.map.remaining,
  revealed: state => state.map.revealed,
  tiles: state => state.map.tiles,
};

// Setup store type
export type Store<S = State> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch'
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload?: P,
    options?: CommitOptions,
  ): ReturnType<Mutations[K]>
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>
  }
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions,
  ): ReturnType<Actions[K]>
};
