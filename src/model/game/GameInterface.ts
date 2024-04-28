import type { Patch } from "#/utils/delta";
import type { Card, CardDump, Plane } from "../card";
import type { DeckDump } from "../deck/Deck";
import type { WallManagerInterface, WallStateDump } from "../wall";

export enum GameType {
	SINGLE = "single",
	MULTI = "multi",
	ETERNITIES = "eternities",
}

export interface GameSpecs {
	type: GameType;
}

export interface GameDump {
	specs: GameSpecs;
	wallStates: WallStateDump;
	hasStarted: boolean;
	deck: DeckDump;
	active: Array<CardDump>;
	revealed?: { relevant: Array<string>; others: Array<string> };
}

export interface Revealed {
	relevant: Array<Card>;
	others: Array<Card>;
}

export interface Initable {
	initiator: string;
}

export interface ChaosInput extends Initable {
	card: Card;
}

export type SinglePlaneswalkInput = Initable;

export interface CustomSinglePlaneswalkInput extends SinglePlaneswalkInput {
	planes: Array<Plane>;
}

export interface EternitiesPlaneswalkInput extends Initable {
	coords: Coordinates;
}

export interface CustomEternitiesPlaneswalkInput
	extends EternitiesPlaneswalkInput {
	planes: Array<Plane>;
}

export interface AddActivePlaneInput extends Initable {
	plane: Plane;
}

export interface UpdateCounterInput {
	planeId: string;
	change: number;
}

export interface RevealUntilInput {
	count: number;
	type?: typeof Card;
}

export interface ResolveRevealInput {
	top: Array<Card>;
	bottom: Array<Card>;
	stop?: boolean;
}

export type PlaneswalkInput =
	| SinglePlaneswalkInput
	| CustomSinglePlaneswalkInput
	| EternitiesPlaneswalkInput
	| CustomEternitiesPlaneswalkInput;
export type ResolveInput = Initable;

export interface GameInterface {
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
}
