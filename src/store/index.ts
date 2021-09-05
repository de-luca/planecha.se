import { createLogger, createStore } from 'vuex';
import { createFeeder } from './plugins/feeder';
import {
  state,
  mutations,
  getters,
  actions,
  Store,
} from './states/map';

// Lazyness Re-exports
export {
  ActionTypes,
  MutationTypes,
} from './states/map';
export type {
  State,
  Store,
} from './states/map';

const plugins = [ createFeeder() ];
if (import.meta.env.MODE !== 'production') {
  plugins.push(createLogger());
}

export const store = createStore({
  state,
  mutations,
  getters,
  actions,
  plugins,
});

export function useStore(): Store {
  return store as Store;
}

export default store;
