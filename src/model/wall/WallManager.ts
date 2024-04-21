import type { EncounterWall } from "./EncounterWall";
import type { PhenomenonWall } from "./PhenomenonWall";
import type { RevealerWall } from "./RevealerWall";

export enum StateKey {
	REVEALER = "REVEALER",
	PHENOMENON_WALL = "PHENOMENON_WALL",
	ENCOUNTER_WALL = "ENCOUNTER_WALL",
}

export enum StateOp {
	SET = "set",
	DELETE = "delete",
}

export interface WallStateMap {
	[StateKey.REVEALER]?: RevealerWall;
	[StateKey.PHENOMENON_WALL]?: PhenomenonWall;
	[StateKey.ENCOUNTER_WALL]?: EncounterWall;
}

type ApplySetInput = { op: StateOp.SET } & (
	| { key: StateKey.REVEALER; val: RevealerWall }
	| { key: StateKey.PHENOMENON_WALL; val: PhenomenonWall }
	| { key: StateKey.ENCOUNTER_WALL; val: EncounterWall }
);

type ApplyDelInput = {
	op: StateOp.DELETE;
	key: StateKey;
};

export type ApplyInput = ApplySetInput | ApplyDelInput;

export interface WallManagerInterface {
	set<T extends StateKey>(key: T, value: WallStateMap[T]): void;
	get<T extends StateKey>(key: T): WallStateMap[T] | undefined;
	has(key: StateKey): boolean;
	isEmpty(): boolean;
	delete<T extends StateKey>(key: T): void;
	apply(input: ApplyInput): void;
	export(): WallStateMap;
}

export class WallManager implements WallManagerInterface {
	private walls: WallStateMap;

	public constructor(states?: WallStateMap) {
		this.walls = states ? { ...states } : {};
	}

	public set<T extends StateKey>(key: T, value: WallStateMap[T]): void {
		this.walls[key] = value;
	}

	public get<T extends StateKey>(key: T): WallStateMap[T] | undefined {
		return this.walls[key];
	}

	public has(key: StateKey): boolean {
		return !!this.walls[key];
	}

	public isEmpty(): boolean {
		return !Object.entries(this.walls).some(Boolean);
	}

	public delete<T extends StateKey>(key: T): void {
		this.walls[key] = undefined;
	}

	public apply(input: ApplyInput): void {
		switch (input.op) {
			case StateOp.SET:
				this.set(input.key, input.val);
				break;
			case StateOp.DELETE:
				this.delete(input.key);
				break;
		}
	}

	public export(): WallStateMap {
		return { ...this.walls };
	}
}
