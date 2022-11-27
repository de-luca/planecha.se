import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Home from '../views/Home.vue';
import About from '../views/About.vue';
import JoinGame from '../views/JoinGame.vue';
import CreateGame from '../views/CreateGame.vue';
import Board from '../views/Board.vue';
import { useMain } from '@/store/main';

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
    path: '/join/:roomId([0-9a-zA-Z]{20})',
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
      try {
        useMain().map;
        return true;
      } catch (_) {
        console.log('NO MAP STATE => /CREATE');
        return '/create';
      }
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    redirect: '/',
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
