import {
    ActionContext,
    Store as VuexStore,
    CommitOptions,
    DispatchOptions,
    createStore,
    createLogger,
} from 'vuex'

import { Map, Classic, Coordinates } from "@/model/map";
import { Card } from "@/model/card";

// Declare state
export type State = {
    map?: Map;
};

// Init state
const state: State = {
    map: undefined,
};


// mutations enums
export enum MutationTypes {
    INIT = 'MAP_INIT',
    PLANESWALK = 'MAP_PLANESWALK',
}

// Mutation contracts
export type Mutations<S = State> = {
    [MutationTypes.INIT](state: S): void
    [MutationTypes.PLANESWALK](state: S): void
}

// Define mutations
const mutations: Mutations = {
    [MutationTypes.INIT](state: State) {
        state.map = new Classic();
    },
    [MutationTypes.PLANESWALK](state: State) {
        (<Map>state.map).planeswalk();
    },
};

// Action enums
export enum ActionTypes {}

// Actions context
type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, undefined>, 'commit'>

// Actions contracts
export interface Actions {}

// Define actions
export const actions: Actions = {}

// Getters types
export type Getters = {
    map(state: State): Map;
    active(state: State): Array<Card>;
    played(state: State): Array<Card>;
    deckSize(state: State): number;
}

// Getters
export const getters: Getters = {
    map: (state) => <Map>state.map,
    active: (state) => (<Map>state.map).active,
    played: (state) => (<Map>state.map).played,
    deckSize: (state) => (<Map>state.map).getDeckSize(),
}

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
        payload: Parameters<Actions[K]>[1],
        options?: DispatchOptions,
    ): ReturnType<Actions[K]>
}

export const store = createStore({
    state,
    mutations,
    getters,
    plugins: process.env.NODE_ENV === 'production'
        ? []
        : [ createLogger() ],
});

export function useStore(): Store {
    return store as Store
}

export default store;