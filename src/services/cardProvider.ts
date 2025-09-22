import {
	type Card,
	type CardDump,
	type Phenomenon,
	Plane,
	type Props,
	build,
} from "@/model/card";
import { Deck, type DeckDump } from "@/model/deck/Deck";
import { shuffle } from "@/utils/shuffle";
import cards from "#assets/cards.json";

type ListInput = CardDump | string;

const raw: Map<string, Props> = (cards as Array<Props>).reduce(
	(acc, p) => acc.set(p.id, p),
	new Map<string, Props>(),
);

export const getCard = <T extends Card>(id: string): T =>
	build(raw.get(id) as Props) as T;

export const getAllCards = (): Array<Card> =>
	[...raw.values()].map((r) => build(r));

export const getCardList = <T extends Card>(list: Array<ListInput>): Array<T> =>
	list.map((item) => {
		if (typeof item === "string") {
			return getCard<T>(item);
		}

		const card = getCard<T>(item.id);
		if (item.counters && card instanceof Plane && card.counter) {
			card.counter.value = item.counters;
		}

		return card;
	});

export const getCardByFilter = (filters: {
	sets: Array<string>;
}) =>
	[...raw.values()]
		.filter((r) => filters.sets.some((s) => r.sets.includes(s)))
		.map((r) => build(r));

// export const getPlaneCards = (): Array<Plane> =>
// 	[...raw.values()]
// 		.filter((r) => r.typeLine !== "Phenomenon")
// 		.map((r) => build(r) as Plane);

// export const getPhenomenonCards = (): Array<Phenomenon> =>
// 	[...raw.values()]
// 		.filter((r) => r.typeLine === "Phenomenon")
// 		.map((r) => build(r) as Phenomenon);

// export const getDeck = (): Deck<Card> => new Deck<Card>(shuffle(getAllCards()));

export const getDeckFromList = (list: Array<ListInput>): Deck<Card> =>
	new Deck<Card>(shuffle(getCardList<Card>(list)));

export const getDecksFromList = (
	list: Array<ListInput>,
): {
	plane: Deck<Plane>;
	phenomenon: Deck<Phenomenon>;
} => {
	const { planes, phenomena } = getCardList(list).reduce<{
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
		plane: new Deck<Plane>(shuffle(getCardList(planes))),
		phenomenon: new Deck<Phenomenon>(shuffle(getCardList(phenomena))),
	};
};

export const restoreDeck = <T extends Card>(state: DeckDump): Deck<T> =>
	new Deck<T>(getCardList(state.cards), getCardList(state.played));
