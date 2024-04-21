declare module "*.vue" {
	import type { DefineComponent } from "vue";
	// biome-ignore lint: Ignore
	const component: DefineComponent<{}, {}, any>;
	export default component;
}
