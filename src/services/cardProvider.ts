import {
	type Card,
	type CardDump,
	type Phenomenon,
	Plane,
	type Props,
	build,
} from "#/model/card";
import { Deck, type DeckDump } from "#/model/deck/Deck";
import { shuffle } from "#/utils/shuffle";
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

export const getPlaneCards = (): Array<Plane> =>
	[...raw.values()]
		.filter((r) => r.typeLine !== "Phenomenon")
		.map((r) => build(r) as Plane);

export const getPhenomenonCards = (): Array<Phenomenon> =>
	[...raw.values()]
		.filter((r) => r.typeLine === "Phenomenon")
		.map((r) => build(r) as Phenomenon);

export const getDeck = (): Deck<Card> => new Deck<Card>(shuffle(getAllCards()));

export const getPlaneDeck = (): Deck<Plane> =>
	new Deck<Plane>(shuffle(getPlaneCards()));

export const getPhenomenonDeck = (): Deck<Phenomenon> =>
	new Deck<Phenomenon>(shuffle(getPhenomenonCards()));

export const getCustomDeck = (list: Array<ListInput>): Deck<Card> =>
	new Deck<Card>(shuffle(getCardList<Card>(list)));

export const restoreDeck = <T extends Card>(state: DeckDump): Deck<T> =>
	new Deck<T>(getCardList(state.cards), getCardList(state.played));
