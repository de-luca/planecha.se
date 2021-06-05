import {
    ActionContext,
    Store as VuexStore,
    CommitOptions,
    DispatchOptions,
    ActionTree,
} from 'vuex'

import { Card, Counter, Plane } from "@/model/card";
import { MapInterface, MapType } from '@/model/map/MapInterface';
import { BuildProps, MapFactory } from '@/model/map/MapFactory';
import { OnlineInterface } from '@/model/net/OnlineInterface';
import Container from 'typedi';

export enum LogType {
    JOIN = 'joined',
    CHAOS = 'rolled chaos',
    PLANESWALK = 'planeswalked to',
    ENCOUNTER = 'encountered',
    COUNTERS = '',
}

export type Log = {
    initiator: string;
    type: LogType;
    outcome?: Array<string>;
}

// Declare state
export type State = {
    map?: MapInterface | MapInterface & OnlineInterface;
    online: boolean;
    logs: Array<Log>;
    mates: Map<string, string>;
};

// Init state
export const state: State = {
    map: undefined,
    online: false,
    logs: [],
    mates: new Map(),
};


// mutations enums
export enum MutationTypes {
    LOG = 'LOG',
    HEY = 'HEY',
    INIT = 'INIT',
    CHAOS = 'CHAOS',
    PLANESWALK = 'PLANESWALK',
    COUNTERS = 'COUNTERS',
}

// Mutation contracts
export type Mutations<S = State> = {
    [MutationTypes.LOG](state: S, payload: Log): void
    [MutationTypes.HEY](state: S, payload: { id: string, name: string }): void
    [MutationTypes.INIT](state: S, payload: BuildProps): void
    [MutationTypes.CHAOS](state: S): void
    [MutationTypes.PLANESWALK](state: S): void
    [MutationTypes.COUNTERS](state: S, payload: { id: string, change: number }): void
}

// Define mutations
export const mutations: Mutations = {
    [MutationTypes.LOG](state: State, payload: Log) {
        state.logs.push(payload);
    },
    [MutationTypes.HEY](state: State, payload: { id: string, name: string }) {
        state.mates.set(payload.id, payload.name);
    },
    [MutationTypes.INIT](state: State, payload: BuildProps) {
        state.map = Container.get(MapFactory).build(payload);
        state.online = payload.online;
    },
    [MutationTypes.CHAOS](state: State) {
        (<MapInterface>state.map).chaos();
    },
    [MutationTypes.PLANESWALK](state: State) {
        (<MapInterface>state.map).planeswalk();
    },
    [MutationTypes.COUNTERS](state: State, payload: { id: string, change: number }) {
        (<Plane>(<MapInterface>state.map).active
            .find(c => c.id === payload.id))
            .updateCounter(payload.change);
    },
};

// Action enums
export enum ActionTypes {
    INIT = 'INIT',
    JOIN = 'JOIN',
    CHAOS = 'CHAOS',
    PLANESWALK = 'PLANESWALK',
    COUNTERS = 'COUNTERS',
}

// Actions context
type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload?: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, undefined>, 'commit'>

// Actions contracts
export interface Actions {
    [ActionTypes.INIT](
        { commit }: AugmentedActionContext,
        payload: BuildProps,
    ): void,
    [ActionTypes.JOIN](
        { commit }: AugmentedActionContext,
        payload: { roomId: string, name: string },
    ): void,
    [ActionTypes.CHAOS](
        { commit }: AugmentedActionContext,
    ): void,
    [ActionTypes.PLANESWALK](
        { commit }: AugmentedActionContext,
    ): void,
    [ActionTypes.COUNTERS](
        { commit }: AugmentedActionContext,
        payload: { id: string, change: number }
    ): void,
 }

// Define actions
export const actions: ActionTree<State, undefined> & Actions = {
    async [ActionTypes.INIT]({ commit }, payload: BuildProps) {
        try {
            commit(MutationTypes.INIT, payload);
            await (<MapInterface>state.map).ready;

            if (payload.online) {
                await (<OnlineInterface>state.map).create();
            }
        } catch (err) {
            console.error(err);
        }
    },
    async [ActionTypes.JOIN]({ commit }, payload: { roomId: string, name: string }) {
        try {
            commit(MutationTypes.INIT, { 
                type: MapType.EMPTY, 
                online: true,
                advanced: { name: payload.name },
            });
            await (<MapInterface>state.map).ready;
            await (<OnlineInterface>state.map).join(payload.roomId);
        } catch (err) {
            // some error handling logic
        }
    },
    [ActionTypes.CHAOS]({ commit }) {
        commit(MutationTypes.CHAOS);
        commit(MutationTypes.LOG, {
            initiator: 'You',
            type: LogType.CHAOS,
        });

        (<OnlineInterface>state.map).requestChaos();
    },
    [ActionTypes.PLANESWALK]({ commit }) {
        commit(MutationTypes.PLANESWALK);
        commit(MutationTypes.LOG, {
            initiator: 'You',
            ...(<MapInterface>state.map).getLog(),
        });
        (<OnlineInterface>state.map).requestPlaneswalk();
    },
    [ActionTypes.COUNTERS]({ commit }, payload: { id: string, change: number }) {
        commit(MutationTypes.COUNTERS, payload);

        const counter = (<Plane>(<MapInterface>state.map).active
            .find(c => c.id === payload.id)).counter as Counter;

        commit(MutationTypes.LOG, {
            initiator: 'You',
            type: LogType.COUNTERS,
            outcome: [
                (payload.change > 0 ? 'added' : 'removed') +
                ` ${Math.abs(payload.change)} ${counter.name} counter (${counter.value})`,
            ],
        });
    },
}

// Getters types
export type Getters = {
    online(state: State): boolean;
    logs(state: State): Array<Log>;
    mates(state: State): Map<string, string>;
    map(state: State): MapInterface;
    type(state: State): MapType;
    active(state: State): Array<Card>;
    played(state: State): Array<Card>;
    deckSize(state: State): number;
}

// Getters
export const getters: Getters = {
    online: state => state.online,
    logs: state => state.logs,
    mates: state => state.mates,
    map: state => <MapInterface>state.map,
    type: state => (<MapInterface>state.map).type,
    active: state => (<MapInterface>state.map).active,
    played: state => (<MapInterface>state.map).played,
    deckSize: state => (<MapInterface>state.map).getDeckSize(),
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
        payload?: Parameters<Actions[K]>[1],
        options?: DispatchOptions,
    ): ReturnType<Actions[K]>
};
