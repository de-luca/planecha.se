import { 
    CommitOptions,
    GetterTree, 
    Module, 
    MutationTree, 
    Store as VuexStore
} from "vuex";
import { State as RootState } from '@/store';

// Declare state
export type State = {
    test: number;
};

// Init state
const state: State = {
    test: 0,
};

// getters types
export type Getters = {
    theTest(state: State): number;
}

// getters
export const getters: GetterTree<State, RootState> & Getters = {
    theTest: (state) => {
        console.log('iamthetest');
        return state.test;
    },
}

//setup store type
export type Store<S = State> = Omit<
    VuexStore<S>,
    'getters'
> & {
    getters: {
        [K in keyof Getters]: ReturnType<Getters[K]>
    }
};

export const NetworkModule: Module<State, RootState> = {
    state,
    getters,
};
