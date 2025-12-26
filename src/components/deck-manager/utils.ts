import { h, type VNode } from "vue";
import type { BaseList, Custom, List, Precon } from "@/types";

export type AnyDeck = Custom | Precon | List;

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

export const isList = (list: BaseList): list is List => "filters" in list;

export const isPrecon = (list: BaseList): list is Precon => "set" in list;

export const isCustom = (list: BaseList): list is Custom =>
	!(isList || isPrecon);

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

export const toDeckList = (list: AnyDeck): DeckList => ({
	list,
	component: buildDesc(list),
});

export const buildDesc = (list: AnyDeck) =>
	isPrecon(list)
		? h("div", { class: "basis-1 grow" }, [
				h("div", { class: "flex" }, [
					h("strong", list.name),
					h("div", { class: "ml-2" }),
					(list.identity ?? []).map((pip) =>
						h("abbr", { class: `pip ${pip}` }, pip),
					),
				]),
				h("div", list.face?.join(" / ")),
				h("small", { class: "text-muted-foreground" }, [
					`${list.set.name} `,
					h("em", list.set.code),
					` (${list.set.year})`,
				]),
			])
		: h("div", { class: "basis-1 grow" }, [
				h("div", { class: "flex" }, h("strong", list.name)),
				h("div", { class: "text-muted-foreground" }, list.desc),
			]);
