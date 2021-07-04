import { createLogger, createStore } from 'vuex';
import { createFeeder } from './plugins/feeder';
import {
  state,
  mutations,
  getters,
  actions,
  Store,
} from '@/store/states/map';


// Lazyness Re-exports
export {
  ActionTypes,
  MutationTypes,
} from '@/store/states/map';
export type {
  State,
  Store,
} from '@/store/states/map';

const plugins = [ createFeeder() ];
if (process.env.NODE_ENV !== 'production') {
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
