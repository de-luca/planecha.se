import { registerSW } from "virtual:pwa-register";
import App from "@/App.vue";
import Link from "@/components/controls/Link.vue";
import "@/main.css";
import { useColorMode } from "@vueuse/core";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { router } from "@/router";
import { feeder, notifier, persister, versionizer } from "@/store/plugins";

useColorMode();
registerSW({ immediate: true });

createApp(App)
	.component("l", Link)
	.use(createPinia().use(feeder).use(notifier).use(persister).use(versionizer))
	.use(router)
	.mount("#app");
