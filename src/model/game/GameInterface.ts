import type { Coordinates } from "@/types";
import type { Patch } from "@/utils/delta";
import type { Card, CardDump, Plane } from "../card";
import type { DeckDump } from "../deck/Deck";
import type { WallManagerInterface, WallStateDump } from "../wall";

export type GameType = "single" | "multi" | "eternities";
export type GameSpecs = { type: GameType };

export type GameDump = {
	specs: GameSpecs;
	wallStates: WallStateDump;
	hasStarted: boolean;
	deck: DeckDump;
	active: Array<CardDump>;
	revealed?: { relevant: Array<string>; others: Array<string> };
};

export type Revealed = {
	relevant: Array<Card>;
	others: Array<Card>;
};

export type Initable = { initiator: string };

export type ChaosInput = Initable & { card: Card };

export type SinglePlaneswalkInput = Initable;

export type CustomSinglePlaneswalkInput = SinglePlaneswalkInput & {
	planes: Array<Plane>;
};

export type EternitiesPlaneswalkInput = Initable & { coords: Coordinates };

export type CustomEternitiesPlaneswalkInput = EternitiesPlaneswalkInput & {
	planes: Array<Plane>;
};

export type AddActivePlaneInput = Initable & { plane: Plane };

export type UpdateCounterInput = {
	planeId: string;
	change: number;
};

export type RevealUntilInput = {
	count: number;
	type?: typeof Card;
};

export type ResolveRevealInput = {
	top: Array<Card>;
	bottom: Array<Card>;
	stop?: boolean;
};

export type PlaneswalkInput =
	| SinglePlaneswalkInput
	| CustomSinglePlaneswalkInput
	| EternitiesPlaneswalkInput
	| CustomEternitiesPlaneswalkInput;
export type ResolveInput = Initable;

export type GameInterface = {
	specs: GameSpecs;
	ready: Promise<void>;
	hasStarted: boolean;
	walls: WallManagerInterface;
	revealed?: Revealed;
	active: Array<Card>;
	remaining: number;
	played: Array<Card>;

	start(): void;
	revealUntil(input: RevealUntilInput): void;
	resolveReveal(input: ResolveRevealInput): void;
	chaos(input: ChaosInput): void;
	planeswalk(input: PlaneswalkInput): void;
	addActivePlane(input: AddActivePlaneInput): void;
	resolve(input: ResolveInput): void;
	updateCounter(input: UpdateCounterInput): void;
	dump(): GameDump;
	apply(patch: Patch, peerId: string): void;
	restore(state: GameDump): void;
};
