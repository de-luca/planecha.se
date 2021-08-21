import 'reflect-metadata';
import './fa';
import './main.scss';
import { createApp } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { store } from './store';
import { router } from './router';
import App from './App.vue';

createApp(App, { store })
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .use(store)
  .mount('#app');
