import 'reflect-metadata';
import './main.scss';
import './fa';
import { createApp } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import { store } from './store';
import { router } from './router';

document.documentElement.setAttribute(
  'data-theme',
  localStorage.getItem('theme') ?? 'sys',
);

createApp(App, { store })
  .component('fa', FontAwesomeIcon)
  .use(router)
  .use(store)
  .mount('#app');
