import 'reflect-metadata';
import './main.scss';
import './fa';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { router } from './router';
import { createFeeder } from './store/plugins/feeder';
import App from './App.vue';

document.documentElement.setAttribute(
  'data-theme',
  localStorage.getItem('theme') ?? 'sys',
);

createApp(App)
  .component('fa', FontAwesomeIcon)
  .use(createPinia().use(createFeeder))
  .use(router)
  .mount('#app');
