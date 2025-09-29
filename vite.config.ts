/// <reference types="bun-types" />

import { join, resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import Vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// import vueDevTools from "vite-plugin-vue-devtools";

const pathSrc = resolve(__dirname, "src");
const pathAssets = join(pathSrc, "assets");

export default defineConfig({
	plugins: [
		Vue(),
		// vueDevTools(),
		tailwindcss(),
		VitePWA({
			base: "/",
			srcDir: "src",
			includeAssets: "cards/*",
			strategies: "generateSW",
			registerType: "autoUpdate",
			manifest: {
				name: "Planecha.se",
				short_name: "Planecha.se",
				description:
					"A Planechase companion app for people playing remotely (or locally)",
				theme_color: "#111111",
				orientation: "landscape",
				display: "standalone",
				icons: [
					{
						src: "favicon/192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "favicon/512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "favicon/512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
				],
			},
			workbox: {
				globPatterns: ["**/*.*"],
			},
		}),
	],
	resolve: {
		alias: {
			"@": pathSrc,
			"#assets": pathAssets,
		},
	},
});
