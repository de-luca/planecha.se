import { describe, expect, it } from "vitest";
import { Phenomenon, Plane } from "../model/card";
import {
	getAllCards,
	getCard,
	getCardList,
	getCustomDeck,
	getDeck,
	getPhenomenonCards,
	getPhenomenonDeck,
	getPlaneCards,
	getPlaneDeck,
	restoreDeck,
} from "./cardProvider";

import cards from "#assets/cards.json";

const CARD_COUNT = cards.length;
const PLANE_COUNT = cards.filter((c) => c.typeLine !== "Phenomenon").length;
const PHENOMENA_COUNT = cards.filter((c) => c.typeLine === "Phenomenon").length;

describe("getCard", () => {
	it("returns a single card", () => {
		const card = getCard("43a23de7-0738-4b03-b87d-5a7d1144825c");
		expect(card.name).toEqual("Glimmervoid Basin");
	});
});

describe("getAllCards", () => {
	it("returns all the cards", () => {
		expect(getAllCards()).toHaveLength(CARD_COUNT);
	});
});

describe("getCardList", () => {
	it("returns only requested cards in order (Array<string>)", () => {
		const ids = [
			"15b979de-c8ee-4664-9ca7-6c4eb3346967",
			"38f84e55-049c-441e-b4e2-1e207ab5dbe5",
		];
		const cards = getCardList(ids);
		expect(cards).toHaveLength(2);
		expect(cards[0].id).toEqual(ids[0]);
		expect(cards[1].id).toEqual(ids[1]);
	});

	it("returns only requested cards in order Array<CardDump>", () => {
		const ids = [
			{ id: "15b979de-c8ee-4664-9ca7-6c4eb3346967" },
			{ id: "38f84e55-049c-441e-b4e2-1e207ab5dbe5" },
		];
		const cards = getCardList(ids);
		expect(cards).toHaveLength(2);
		expect(cards[0].id).toEqual(ids[0].id);
		expect(cards[1].id).toEqual(ids[1].id);
	});
});

describe("getPlaneCards", () => {
	it("returns only planes", () => {
		const planes = getPlaneCards();
		expect(planes).toHaveLength(PLANE_COUNT);
		expect(planes.every((p) => p instanceof Plane)).toBe(true);
	});
});

describe("getPhenomenonCards", () => {
	it("returns only phenomena", () => {
		const phenomena = getPhenomenonCards();
		expect(phenomena).toHaveLength(PHENOMENA_COUNT);
		expect(phenomena.every((p) => p instanceof Phenomenon)).toBe(true);
	});
});

describe("getDeck", () => {
	it("returns a shuffled deck with all cards available", () => {
		expect(getDeck().remaining).toEqual(CARD_COUNT);
	});
});

describe("getPlaneDeck", () => {
	it("returns a deck with only planes", () => {
		const planeDeck = getPlaneDeck();
		expect(planeDeck.remaining).toEqual(PLANE_COUNT);
		while (planeDeck.remaining > 0) {
			expect(planeDeck.draw()).toBeInstanceOf(Plane);
		}
	});
});

describe("getPhenomenonDeck", () => {
	it("returns a deck with only phenomena", () => {
		const phenomenonDeck = getPhenomenonDeck();
		expect(phenomenonDeck.remaining).toEqual(PHENOMENA_COUNT);
		while (phenomenonDeck.remaining > 0) {
			expect(phenomenonDeck.draw()).toBeInstanceOf(Phenomenon);
		}
	});
});

describe("getCustomDeck", () => {
	it("returns a deck with only requested cards", () => {
		const ids = [
			"15b979de-c8ee-4664-9ca7-6c4eb3346967",
			"38f84e55-049c-441e-b4e2-1e207ab5dbe5",
		];
		const deck = getCustomDeck(ids);
		expect(deck.remaining).toEqual(2);
		while (deck.remaining > 0) {
			expect(ids).toContain(deck.draw().id);
		}
	});
});

describe("restoreDeck", () => {
	it("returns a Deck from a DeckState", () => {
		const deck = restoreDeck({
			cards: [{ id: "15b979de-c8ee-4664-9ca7-6c4eb3346967" }],
			played: [{ id: "38f84e55-049c-441e-b4e2-1e207ab5dbe5" }],
		});
		expect(deck.remaining).toEqual(1);
		expect(deck.played).toHaveLength(1);
		expect(deck.played[0].id).toEqual("38f84e55-049c-441e-b4e2-1e207ab5dbe5");
		expect(deck.draw().id).toEqual("15b979de-c8ee-4664-9ca7-6c4eb3346967");
	});
});
