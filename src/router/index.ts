import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import JoinGame from '../views/JoinGame.vue';
import CreateGame from '../views/CreateGame.vue';
import Board from '../views/Board.vue';
import { useStore } from '@/store';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/join',
    name: 'JoinGame',
    component: JoinGame,
  },
  {
    path: '/create',
    name: 'CreateGame',
    component: CreateGame,
  },
  {
    path: '/board',
    name: 'Board',
    component: Board,
    beforeEnter: () => {
      if (useStore().getters.map === undefined) {
        console.log('NO MAP STATE => /CREATE');
        return '/create';
      }
      return true;
    }
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
