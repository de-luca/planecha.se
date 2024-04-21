import { Card, Plane } from "#/model/card";
import { GameType } from "#/model/game";
import type { EternitiesMapDeckType } from "#/model/game/eternities";

export interface DeckReqs {
	mapType: GameType;
	deckType?: EternitiesMapDeckType;
}

export type CardType = "cards" | "planes" | "phenomena";
export type ProceedType = "save_use" | "save" | "use";
export type DeckKind = "all" | "planes";

export type Counts = Record<CardType, number>;
export interface SavedDeck {
	list: Array<string>;
	kind: DeckKind;
	counts: Counts;
}

export interface DeckState {
	valid: boolean;
	reqs: Array<{ valid: boolean; text: string }>;
}

export interface Requirement {
	name: string;
	type: typeof Card;
	min: number;
	max?: number;
}

type Requirements = Record<GameType, Partial<Record<CardType, Requirement>>>;
export const REQUIREMENTS: Requirements = {
	[GameType.SINGLE]: {
		planes: { name: "Planes", type: Plane, min: 5 },
	},
	[GameType.MULTI]: {
		cards: { name: "Cards", type: Card, min: 10, max: 10 },
		planes: { name: "Planes", type: Plane, min: 5 },
	},
	[GameType.ETERNITIES]: {
		planes: { name: "Planes", type: Plane, min: 25 },
	},
};

export function getDeckState(type: GameType, deck: Array<Card>): DeckState {
	const req = REQUIREMENTS[type];
	const counts = Object.keys(req).map(() => 0);
	for (const card of deck) {
		Object.values(req).forEach((r, i) => card instanceof r.type && counts[i]++);
	}
	const reqs = Object.values(req).map((r, i) => {
		const valid =
			counts[i] >= r.min && counts[i] <= (r.max ?? Number.POSITIVE_INFINITY);
		return { valid, text: `${r.name}: ${counts[i]}/${r.min}` };
	});
	return { reqs, valid: reqs.every((r) => r.valid) };
}
