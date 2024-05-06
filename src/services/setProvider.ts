import { type Component, markRaw } from "vue";
import * as setIcons from "#/components/svgs/sets";
import sets from "#assets/sets.json";

export interface Set {
	name: string;
	code: string;
	icon: Component;
}

const raw: Map<string, Set> = sets.reduce(
	(acc, s) =>
		acc.set(s.code, {
			...s,
			icon: markRaw(setIcons[s.code as keyof typeof setIcons]),
		}),
	new Map(),
);

export const getSets = (): Map<string, Set> => raw;
