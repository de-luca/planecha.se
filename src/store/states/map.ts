import {
    ActionContext,
    Store as VuexStore,
    CommitOptions,
    DispatchOptions,
    ActionTree,
} from 'vuex'

import { Card } from "@/model/card";
import { MapInterface, MapType } from '@/model/map/MapInterface';
import { FactoryProps, MapFactory } from '@/model/map/MapFactory';

// Declare state
export type State = {
    map?: MapInterface;
    online: boolean;
};

// Init state
export const state: State = {
    map: undefined,
    online: false,
};


// mutations enums
export enum MutationTypes {
    INIT = 'INIT',
    PLANESWALK = 'PLANESWALK',
}

// Mutation contracts
export type Mutations<S = State> = {
    [MutationTypes.INIT](state: S, payload: FactoryProps): void
    [MutationTypes.PLANESWALK](state: S): void
}

// Define mutations
export const mutations: Mutations = {
    [MutationTypes.INIT](state: State, payload: FactoryProps) {
        state.map = new MapFactory(payload).build();
        state.online = payload.online;
    },
    [MutationTypes.PLANESWALK](state: State) {
        (<MapInterface>state.map).planeswalk();
    },
};

// Action enums
export enum ActionTypes {
    INIT = 'INIT',
}

// Actions context
type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, undefined>, 'commit'>

// Actions contracts
export interface Actions {
    [ActionTypes.INIT](
        { commit }: AugmentedActionContext,
        payload: FactoryProps,
    ): void
 }

// Define actions
export const actions: ActionTree<State, undefined> & Actions = {
    async [ActionTypes.INIT](
        { commit }, 
        payload: FactoryProps,
    ) {
        try {
            commit(MutationTypes.INIT, payload);
            await (<MapInterface>state.map).ready;
        } catch (err) {
            // some error handling logic
        }
    },
}

// Getters types
export type Getters = {
    map(state: State): MapInterface;
    type(state: State): MapType;
    active(state: State): Array<Card>;
    played(state: State): Array<Card>;
    deckSize(state: State): number;
}

// Getters
export const getters: Getters = {
    map: (state) => <MapInterface>state.map,
    type: (state) => (<MapInterface>state.map).type,
    active: (state) => (<MapInterface>state.map).active,
    played: (state) => (<MapInterface>state.map).played,
    deckSize: (state) => (<MapInterface>state.map).getDeckSize(),
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
};
