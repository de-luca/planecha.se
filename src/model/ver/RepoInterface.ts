import type { Patch } from "@/utils/delta";
import type { GameDump } from "../game";

export type Clone = {
	head: number;
	patches: Array<Patch>;
};

export type MaybeDump = GameDump | Record<string, never> | undefined;

export type RepoInterface = {
	head: number;
	getStableIndex(index?: number): number;
	commit(event: string, newVersion: GameDump): Patch;
	apply(patch: Patch): void;
	checkout(index: number): GameDump;
	clone(): Clone;
};
