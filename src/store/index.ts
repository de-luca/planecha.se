import { createLogger, createStore } from 'vuex'
import {
    MapModule,
    Store as MapStore,
    State as MapState,
} from './modules/map'
import {
    NetworkModule,
    Store as NetworkStore,
    State as NetworkState,
} from './modules/network'

export type State = {
    map: MapState;
    network: NetworkState;
};

export type Store = MapStore<Pick<State, 'map'>> &
    NetworkStore<Pick<State, 'network'>>;

export const store = createStore({
    plugins: process.env.NODE_ENV === 'production'
        ? []
        : [createLogger()],
    modules: {
        MapModule,
        NetworkModule,
    },
});

export function useStore(): Store {
    return store as Store;
};

export default store;