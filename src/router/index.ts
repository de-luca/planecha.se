import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import NotHome from '../views/NotHome.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/nothome',
    name: 'NotHome',
    component: NotHome,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
