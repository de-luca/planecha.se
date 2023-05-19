import type { Exported } from '../map';
import { Patch } from '#/utils/delta';

export interface Clone {
  head: number;
  patches: Array<Patch>;
}

export type MaybeExported = Exported | Record<string, never> | undefined;

export interface RepoInterface {
  head: number;
  getStableIndex(index?: number): number;
  commit(event: string, newVersion: Exported): Patch;
  apply(patch: Patch): void;
  checkout(index: number): Exported;
  clone(): Clone;
}
