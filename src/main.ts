import 'reflect-metadata';
import './main.scss';
import './fa';
import VueTippy from 'vue-tippy';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
} from '@fortawesome/vue-fontawesome';
import { router } from './router';
import { createFeeder } from './store/plugins/feeder';
import { versionizer } from './store/plugins/versionizer';
import App from './App.vue';

document.documentElement.setAttribute(
  'data-theme',
  localStorage.getItem('theme') ?? 'sys',
);

createApp(App)
  .component('fa', FontAwesomeIcon)
  .component('fal', FontAwesomeLayers)
  .use(
    createPinia()
      .use(createFeeder)
      .use(versionizer),
  )
  .use(router)
  .use(VueTippy)
  .mount('#app');
