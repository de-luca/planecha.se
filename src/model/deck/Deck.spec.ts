import { describe, expect, it, vi } from "vitest";
import { getDeck } from "#/services/cardProvider";
import { Card, Plane } from "../card";

import cards from "#assets/cards.json";

const CARD_COUNT = cards.length;

describe("Deck.draw", () => {
	it("draws a card", () => {
		const deck = getDeck();
		expect(deck.remaining).toEqual(CARD_COUNT);
		const drawn = deck.draw();
		expect(drawn).toBeInstanceOf(Card);
		expect(deck.remaining).toEqual(CARD_COUNT - 1);
	});

	it("reshuffle and draws a card", () => {
		const deck = getDeck();
		const shuffleSpy = vi.spyOn(deck, "shuffle");
		while (deck.remaining > 0) {
			deck.setPlayed(deck.draw());
		}
		expect(deck.played).toHaveLength(CARD_COUNT);
		expect(deck.remaining).toEqual(0);
		const drawn = deck.draw();
		expect(drawn).toBeInstanceOf(Card);
		expect(deck.remaining).toEqual(CARD_COUNT - 1);
		expect(deck.played).toHaveLength(0);
		expect(shuffleSpy).toHaveBeenCalled();
	});
});

describe("Deck.setPlayed", () => {
	it("sets a played card in the played pile", () => {
		const deck = getDeck();
		const drawn = deck.draw();
		deck.setPlayed(drawn);
		expect(deck.remaining).toEqual(CARD_COUNT - 1);
		expect(deck.played).toHaveLength(1);
	});
});

describe("Deck.drawPlane", () => {
	it("draws a plane", () => {
		const deck = getDeck();
		const drawn = deck.drawPlane();
		expect(drawn).toBeInstanceOf(Plane);
		expect(deck.remaining).toEqual(CARD_COUNT - deck.played.length - 1);
	});
});

describe("Deck.shuffle", () => {
	it("shuffled played cards back", () => {
		const deck = getDeck();
		while (deck.remaining > 0) {
			deck.setPlayed(deck.draw());
		}
		expect(deck.played).toHaveLength(CARD_COUNT);
		expect(deck.remaining).toEqual(0);
		deck.shuffle();
		expect(deck.remaining).toEqual(CARD_COUNT);
		expect(deck.played).toHaveLength(0);
	});
});

describe("Deck.revealUntil", () => {
	it("reveals a given number of requested Plane", () => {
		const deck = getDeck();
		const revealed = deck.revealUntil(2, Plane);
		expect(revealed.relevant).toHaveLength(2);
		for (const card of revealed.relevant) {
			expect(card).toBeInstanceOf(Plane);
		}
		for (const card of revealed.others) {
			expect(card).not.toBeInstanceOf(Plane);
		}
	});

	it("reveals a given number of requested Card", () => {
		const deck = getDeck();
		const revealed = deck.revealUntil(2);
		expect(revealed.relevant).toHaveLength(2);
		expect(revealed.others).toHaveLength(0);
		for (const card of revealed.relevant) {
			expect(card).toBeInstanceOf(Card);
		}
	});
});

describe("Deck.putOnTop", () => {
	it("puts given cards on top of the deck", () => {
		const deck = getDeck();
		const card = deck.draw();
		deck.putOnTop([card]);
		expect(deck.remaining).toEqual(CARD_COUNT);
		expect(deck.draw()).toEqual(card);
	});
});

describe("Deck.putOnTheBottom", () => {
	it("puts given cards on the bottom of the deck", () => {
		const deck = getDeck();
		const card = deck.draw();
		deck.putOnTheBottom([card]);
		expect(deck.remaining).toEqual(CARD_COUNT);
		while (deck.remaining > 1) {
			deck.draw();
		}
		expect(deck.remaining).toEqual(1);
		expect(deck.draw()).toEqual(card);
	});
});
