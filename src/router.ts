import {
	createRouter,
	createWebHashHistory,
	type RouteRecordRaw,
} from "vue-router";

import { useMain } from "@/store/main";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		component: () => import("@/views/Home.vue"),
	},
	{
		path: "/about",
		name: "About",
		component: () => import("@/views/About.vue"),
	},
	{
		path: "/create",
		name: "Create",
		component: () => import("@/views/Create.vue"),
	},
	{
		path: "/game/:roomId([0-9a-zA-Z-]*)",
		name: "Join",
		component: () => import("@/views/Game.vue"),
	},
	{
		path: "/game",
		name: "Game",
		component: () => import("@/views/Game.vue"),
		beforeEnter: () => {
			try {
				useMain().game;
				return true;
			} catch (_) {
				console.log("NO MAP STATE => /CREATE");
				return "/create";
			}
		},
	},
	{
		path: "/:pathMatch(.*)*",
		name: "404",
		redirect: "/",
	},
];

export const router = createRouter({
	history: createWebHashHistory(),
	routes,
});
