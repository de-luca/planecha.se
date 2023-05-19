import cloneDeep from 'lodash.clonedeep';
import { Delta as jsonDelta, diff as jsonDiff, patch as jsonPatch } from '@n1ru4l/json-patch-plus';

export type Delta = jsonDelta;
export interface Patch {
  event: string;
  delta?: Delta;
}

export function diff<T>(a: T, b: T): Delta {
  return jsonDiff({ left: a, right: b });
}

export function patch<T, U>(base: NonNullable<T>, delta: Delta): U {
  return jsonPatch({ left: base, delta: cloneDeep(delta) }) as U;
}
