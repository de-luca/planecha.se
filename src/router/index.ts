import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import JoinGame from '../views/JoinGame.vue';
import CreateGame from '../views/CreateGame.vue';

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
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
