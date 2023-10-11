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
import { registerSW } from 'virtual:pwa-register';
import { router } from './router';
import { createFeeder } from './store/plugins/feeder';
import { versionizer } from './store/plugins/versionizer';
import Link from './components/controls/Link.vue';
import Modal from './components/controls/Modal.vue';
import Tip from './components/controls/Tip.vue';
import App from './App.vue';


registerSW({ immediate: true });

document.documentElement.setAttribute(
  'data-theme',
  localStorage.getItem('theme') ?? 'sys',
);

createApp(App)
  .component('fa', FontAwesomeIcon)
  .component('fal', FontAwesomeLayers)
  .component('l', Link)
  .component('modal', Modal)
  .component('tip', Tip)
  .use(
    createPinia()
      .use(createFeeder)
      .use(versionizer),
  )
  .use(router)
  .use(VueTippy)
  .mount('#app');
