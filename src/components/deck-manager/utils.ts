import type { BaseList } from "@/types/index";
import type { VNode } from "vue";

export type DeckList = {
	list: BaseList;
	component: VNode;
};

export type Props = {
	minCards: number;
	maxCards?: number;
	minPlanes: number;
	phenomena: boolean;
};

export const isDeckListUseable = (
	list: BaseList,
	props: Props,
): {
	useable: boolean;
	issues: Array<string>;
} => {
	const issues: Array<string> = [];
	const count = props.phenomena
		? list.counts.cards
		: list.counts.cards - list.counts.phenomena;

	if (list.counts.planes < props.minPlanes) {
		issues.push(
			`Deck does not have required minimum number of Planes (${list.counts.planes} / ${props.minPlanes})`,
		);
	}

	if (count < props.minCards) {
		issues.push(
			`Deck does not have required minimum number of Cards (${count} / ${props.minCards})`,
		);
	}

	if (props.maxCards && count > props.maxCards) {
		issues.push(
			`Deck exceed maximum number of Cards (${count} / ${props.maxCards})`,
		);
	}

	return {
		useable: issues.length === 0,
		issues,
	};
};

// export interface DeckReqs {
// 	mapType: GameType;
// 	deckType?: EternitiesMapDeckType;
// }

// export type CardType = "cards" | "planes" | "phenomena";
// export type ProceedType = "save_use" | "save" | "use";
// export type DeckKind = "all" | "planes";

// export type Counts = Record<CardType, number>;

// export interface DeckState {
// 	valid: boolean;
// 	reqs: Array<{ valid: boolean; text: string }>;
// }

// export interface Requirement {
// 	name: string;
// 	type: typeof Card;
// 	min: number;
// 	max?: number;
// }

// type Requirements = Record<GameType, Partial<Record<CardType, Requirement>>>;
// export const REQUIREMENTS: Requirements = {
// 	[GameType.SINGLE]: {
// 		planes: { name: "Planes", type: Plane, min: 5 },
// 	},
// 	[GameType.MULTI]: {
// 		cards: { name: "Cards", type: Card, min: 10, max: 10 },
// 		planes: { name: "Planes", type: Plane, min: 5 },
// 	},
// 	[GameType.ETERNITIES]: {
// 		planes: { name: "Planes", type: Plane, min: 25 },
// 	},
// };

// export function getDeckState(type: GameType, deck: Array<Card>): DeckState {
// 	const req = REQUIREMENTS[type];
// 	const counts = Object.keys(req).map(() => 0);
// 	for (const card of deck) {
// 		Object.values(req).forEach((r, i) => card instanceof r.type && counts[i]++);
// 	}
// 	const reqs = Object.values(req).map((r, i) => {
// 		const valid =
// 			counts[i] >= r.min && counts[i] <= (r.max ?? Number.POSITIVE_INFINITY);
// 		return { valid, text: `${r.name}: ${counts[i]}/${r.min}` };
// 	});
// 	return { reqs, valid: reqs.every((r) => r.valid) };
// }
