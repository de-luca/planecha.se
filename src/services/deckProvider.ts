import cloneDeep from "lodash.clonedeep";
import { type Card, type CardDump, type Phenomenon, Plane } from "@/model/card";
import { Deck, type DeckDump } from "@/model/deck/Deck";
import { shuffle } from "@/utils/shuffle";
import { getCard } from "./cardProvider";

type ListInput = CardDump | string;

const copy = <T extends Card>(card: T, apply?: (card: T) => void): T => {
	const copied = cloneDeep(card);
	if (apply) {
		apply(copied);
	}
	return copied;
};

export const getList = <T extends Card>(list: Array<ListInput>): Array<T> =>
	list.map((item) =>
		typeof item === "string"
			? copy(getCard(item))
			: copy(getCard(item.id), (card) => {
					if (item.counters && card instanceof Plane && card.counter) {
						card.counter.value = item.counters;
					}
				}),
	);

export const getDeckFromList = (list: Array<ListInput>): Deck<Card> =>
	new Deck<Card>(shuffle(getList(list)));

export const getSplitDeckFromList = (
	list: Array<ListInput>,
): {
	plane: Deck<Plane>;
	phenomenon: Deck<Phenomenon>;
} => {
	const { planes, phenomena } = getList(list).reduce<{
		planes: Array<Plane>;
		phenomena: Array<Phenomenon>;
	}>(
		(acc, card) => {
			card instanceof Plane
				? acc.planes.push(card)
				: acc.phenomena.push(card as Phenomenon);
			return acc;
		},
		{ planes: [], phenomena: [] },
	);

	return {
		plane: new Deck<Plane>(shuffle(planes)),
		phenomenon: new Deck<Phenomenon>(shuffle(phenomena)),
	};
};

export const restoreDeck = <T extends Card>(state: DeckDump) =>
	new Deck<T>(getList(state.cards), getList(state.played));
