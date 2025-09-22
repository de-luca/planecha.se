import type { EncounterWall, PhenomenonWall, RevealerWall } from "./types";

export enum StateKey {
	REVEALER = 0,
	PHENOMENON_WALL = 1,
	ENCOUNTER_WALL = 2,
}

export enum StateOp {
	SET = 0,
	DELETE = 1,
}

export type WallStateMap = {
	[StateKey.REVEALER]?: RevealerWall;
	[StateKey.PHENOMENON_WALL]?: PhenomenonWall;
	[StateKey.ENCOUNTER_WALL]?: EncounterWall;
};

export type WallStateDump = WallStateMap;

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

export type WallManagerInterface = {
	set<T extends StateKey>(key: T, value: WallStateMap[T]): void;
	get<T extends StateKey>(key: T): WallStateMap[T] | undefined;
	has(key: StateKey): boolean;
	isEmpty(): boolean;
	delete<T extends StateKey>(key: T): void;
	apply(input: ApplyInput): void;
	dump(): WallStateMap;
};

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
		const entries = Object.entries(this.walls);
		return entries.length === 0 || entries.some(Boolean);
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

	public dump(): WallStateDump {
		return { ...this.walls };
	}
}
