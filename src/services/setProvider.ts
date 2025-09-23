import { type Component, markRaw } from "vue";
import sets from "#assets/sets.json";
import * as setIcons from "@/components/svgs/sets";

export type Set = {
	name: string;
	code: string;
	icon: Component;
};

const raw: Map<string, Set> = sets.reduce(
	(acc, s) =>
		acc.set(s.code, {
			...s,
			// biome-ignore lint/performance/noDynamicNamespaceImportAccess: ignore
			icon: markRaw(setIcons[s.code as keyof typeof setIcons]),
		}),
	new Map(),
);

export const getSets = (): Map<string, Set> => raw;
