import {
	type Delta as jsonDelta,
	diff as jsonDiff,
	patch as jsonPatch,
} from "@n1ru4l/json-patch-plus";
import cloneDeep from "lodash.clonedeep";

export type Delta = jsonDelta;
export type Patch = {
	event: string;
	stable: boolean;
	delta?: Delta;
};

export const diff = <T>(a: T, b: T): Delta => jsonDiff({ left: a, right: b });

export const patch = <T, U>(base: NonNullable<T>, delta: Delta): U =>
	jsonPatch({ left: base, delta: cloneDeep(delta) }) as U;
