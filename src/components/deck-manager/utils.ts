import type { VNode } from "vue";
import type { BaseList } from "@/types";

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
	list: Omit<BaseList, "id" | "name">,
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
