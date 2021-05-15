import { Map, Classic } from "@/model/map";
import { 
    CommitOptions,
    GetterTree, 
    Module, 
    MutationTree, 
    Store as VuexStore
} from "vuex";
import { State as RootState } from '@/store';
import { Card, Plane } from "@/model/card";

// Declare state
export type State = {
    map?: Map;
};

// Init state
const state: State = {
    map: undefined,
};

// getters types
export type Getters = {
    map(state: State): Map | undefined;
    active(state: State): Array<Card>;
    played(state: State): Array<Card>;
    deckSize(state: State): number;
}

// getters
export const getters: GetterTree<State, RootState> & Getters = {
    map: (state) => state.map,
    active: (state) => (<Map>state.map).active,
    played: (state) => (<Map>state.map).played,
    deckSize: (state) => (<Map>state.map).getDeckSize(),
};

const actions = {};

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
const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.INIT](state: State) {
        state.map = new Classic();
    },
    [MutationTypes.PLANESWALK](state: State) {
        (<Map>state.map).planeswalk();
    },
};

//setup store type
export type Store<S = State> = Omit<
    VuexStore<S>,
    'commit' | 'getters'
> & {
    commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
        key: K,
        payload: P,
        options?: CommitOptions,
    ): ReturnType<Mutations[K]>
} & {
    getters: {
        [K in keyof Getters]: ReturnType<Getters[K]>
    }
};

export const MapModule: Module<State, RootState> = {
    state,
    getters,
    actions,
    mutations, 
};
