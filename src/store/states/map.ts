import {
    ActionContext,
    Store as VuexStore,
    CommitOptions,
    DispatchOptions,
    ActionTree,
} from 'vuex'

import { Card, Plane } from "@/model/card";
import { Exported, MapInterface, MapType, Revealed } from '@/model/map/MapInterface';
import { BuildProps, MapFactory } from '@/model/map/MapFactory';
import { OnlineInterface } from '@/model/net/OnlineInterface';
import Container from 'typedi';


// Declare state
export type State = {
    map?: MapInterface | MapInterface & OnlineInterface;
    feed: Array<string>;

    online: boolean;
    mates: Map<string, string>;

    shuffled: boolean;
};

// Init state
export const state: State = {
    map: undefined,
    feed: [],
    online: false,
    mates: new Map(),
    shuffled: false,
};


export type Idable = { mateId?: string };
export type Passiveable = { passive?: boolean };

export type HeyPayload = { id: string, name: string };
export type RevealPayload = { count: number, type?: typeof Card };
export type ChaosPayload = Idable & Passiveable;
export type PlaneswalkPayload = Idable & Passiveable;
export type CustomPlaneswalkPayload = PlaneswalkPayload & { planes: Array<Plane> };
export type CounterPayload = Idable & { id: string, change: number };
export type ResolveRevealPayload = Idable & { top: Array<Card>, bottom: Array<Card> };

// mutations enums
export enum MutationTypes {
    HEY = 'HEY',
    INIT = 'INIT',
    SHUFFLE = 'SHUFFLE',
    CHAOS = 'CHAOS',
    PLANESWALK = 'PLANESWALK',
    CUSTOM_PLANESWALK = 'CUSTOM_PLANESWALK',
    COUNTERS = 'COUNTERS',
    REVEAL = 'REVEAL',
    RESOLVE_REVEAL = 'RESOLVE_REVEAL',
}

// Mutation contracts
export type Mutations<S = State> = {
    [MutationTypes.HEY](state: S, payload: HeyPayload): void,
    [MutationTypes.INIT](state: S, payload: BuildProps): void,
    [MutationTypes.SHUFFLE](state: S, payload: Exported): void,
    [MutationTypes.CHAOS](state: S, payload: ChaosPayload): void,
    [MutationTypes.PLANESWALK](state: S, payload: PlaneswalkPayload): void,
    [MutationTypes.CUSTOM_PLANESWALK](state: S, payload: CustomPlaneswalkPayload): void,
    [MutationTypes.COUNTERS](state: S, payload: CounterPayload): void,
    [MutationTypes.REVEAL](state: S, payload: RevealPayload): void,
    [MutationTypes.RESOLVE_REVEAL](state: S, payload: ResolveRevealPayload): void,
}

// Define mutations
export const mutations: Mutations = {
    [MutationTypes.HEY](state: State, payload: HeyPayload) {
        state.mates.set(payload.id, payload.name);
    },
    [MutationTypes.INIT](state: State, payload: BuildProps) {
        state.map = Container.get(MapFactory).build(payload);
        state.online = payload.online;
    },
    [MutationTypes.SHUFFLE](state: State, payload: Exported) {
        (<MapInterface>state.map).applyShuffle(payload);
    },
    [MutationTypes.CHAOS](state: State, payload: ChaosPayload = {}) {
        (<MapInterface>state.map).chaos(payload.passive);
    },
    [MutationTypes.PLANESWALK](state: State, payload: PlaneswalkPayload = {}) {
        console.log(payload);
        state.shuffled = (<MapInterface>state.map).planeswalk(undefined, payload.passive);
    },
    [MutationTypes.CUSTOM_PLANESWALK](state: State, payload: CustomPlaneswalkPayload) {
        (<MapInterface>state.map).customPlaneswalk(payload.planes, undefined, payload.passive);
    },
    [MutationTypes.COUNTERS](state: State, payload: CounterPayload) {
        (<MapInterface>state.map).updateCounter(payload.id, payload.change);
    },

    [MutationTypes.REVEAL](state: State, payload: RevealPayload) {
        state.shuffled = (<MapInterface>state.map).revealUntil(payload.count, payload.type);
    },
    [MutationTypes.RESOLVE_REVEAL](state: State, payload: ResolveRevealPayload) {
        (<MapInterface>state.map).resolveReveal(payload.top, payload.bottom);
    },
};

// Action enums
export enum ActionTypes {
    INIT = 'INIT',
    JOIN = 'JOIN',
    CHAOS = 'CHAOS',
    PLANESWALK = 'PLANESWALK',
    CUSTOM_PLANESWALK = 'CUSTOM_PLANESWALK',
    COUNTERS = 'COUNTERS',
    REVEAL = 'REVEAL',
    RESOLVE_REVEAL = 'RESOLVE_REVEAL',
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
        payload: { roomId: string, name: string },
    ): Promise<void>,
    [ActionTypes.CHAOS](
        { commit }: AugmentedActionContext,
    ): void,
    [ActionTypes.PLANESWALK](
        { commit }: AugmentedActionContext,
    ): void,
    [ActionTypes.CUSTOM_PLANESWALK](
        { commit }: AugmentedActionContext,
        payload: { planes: Array<Plane> },
    ): void,
    [ActionTypes.COUNTERS](
        { commit }: AugmentedActionContext,
        payload: { id: string, change: number },
    ): void,
    [ActionTypes.REVEAL](
        { commit }: AugmentedActionContext,
        payload: { count: number, type?: typeof Card },
    ): void,
    [ActionTypes.RESOLVE_REVEAL](
        { commit }: AugmentedActionContext,
        payload: { top: Array<Card>, bottom: Array<Card> },
    ): void,
 }

// Define actions
export const actions: ActionTree<State, State> & Actions = {
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

        if (state.online) {
            (state.map as OnlineInterface).requestChaos();
        }
    },
    [ActionTypes.PLANESWALK]({ commit }) {
        commit(MutationTypes.PLANESWALK);
        if (state.online) {
            if (state.shuffled) {
                (state.map as OnlineInterface).requestShuffling();
                state.shuffled = false;
            } else {
                (state.map as OnlineInterface).requestPlaneswalk();
            }
        }
    },
    [ActionTypes.CUSTOM_PLANESWALK]({ commit }, payload: { planes: Array<Plane> }) {
        commit(MutationTypes.CUSTOM_PLANESWALK, payload);

        if (state.online) {
            (state.map as OnlineInterface).requestCustomPlaneswalk({
                planes: payload.planes.map(c => c.id),
            });
        }
    },
    [ActionTypes.COUNTERS]({ commit }, payload: { id: string, change: number }) {
        commit(MutationTypes.COUNTERS, payload);
        
        if (state.online) {
            (state.map as OnlineInterface).requestCounterUpdate(payload);
        }
    },
    [ActionTypes.REVEAL]({ commit }, payload: { count: number, type?: typeof Card }) {
        commit(MutationTypes.REVEAL, payload);
        if (state.online) {
            if (state.shuffled) {
                (state.map as OnlineInterface).requestShuffling();
                state.shuffled = false;
            } else {
                (state.map as OnlineInterface).requestReveal({
                    count: payload.count,
                    type: payload.type?.name,
                });
            }
        }
    },
    [ActionTypes.RESOLVE_REVEAL]({ commit }, payload: { top: Array<Card>, bottom: Array<Card> }) {
        commit(MutationTypes.RESOLVE_REVEAL, payload);
        if (state.online) {
            (state.map as OnlineInterface).requestRevealResolution({
                top: payload.top.map(c => c.id),
                bottom: payload.bottom.map(c => c.id),
            });
        }
    },
}

// Getters types
export type Getters = {
    feed(state: State): Array<string>;
    online(state: State): boolean;
    mates(state: State): Map<string, string>;
    map(state: State): MapInterface;
    type(state: State): MapType;
    active(state: State): Array<Card>;
    played(state: State): Array<Card>;
    revealed(state: State): Revealed | undefined;
    deckSize(state: State): number;
}

// Getters
export const getters: Getters = {
    feed: state => state.feed,
    online: state => state.online,
    mates: state => state.mates,
    map: state => <MapInterface>state.map,
    type: state => (<MapInterface>state.map).type,
    active: state => (<MapInterface>state.map).active,
    played: state => (<MapInterface>state.map).played,
    revealed: state => (<MapInterface>state.map).revealed,
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
