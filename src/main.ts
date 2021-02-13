import 'reflect-metadata';
import { createApp } from 'vue';
import { router } from './router';
import App from './App.vue';
import './main.scss';

createApp(App)
  .use(router)
  .mount('#app');
