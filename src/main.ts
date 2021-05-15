import 'reflect-metadata';
import './main.scss';
import { createApp } from 'vue';
import { store } from './store';
import { router } from './router';
import App from './App.vue';

createApp(App, { store })
  .use(router)
  .use(store)
  .mount('#app');
