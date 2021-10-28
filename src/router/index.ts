import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import { useMain } from '@/store/main';
import { EmptyMap } from '@/model/map';

import Home from '../views/Home.vue';
import About from '../views/About.vue';
import JoinGame from '../views/JoinGame.vue';
import CreateGame from '../views/CreateGame.vue';
import Board from '../views/Board.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/join/:roomId?',
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
      if (useMain().map instanceof EmptyMap) {
        console.log('NO MAP STATE => /CREATE');
        return '/create';
      }
      return true;
    },
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
