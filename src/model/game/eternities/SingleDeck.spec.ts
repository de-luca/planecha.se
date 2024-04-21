import { describe, expect, it } from "vitest";
import { WallManager } from "#/model/wall";
import { getPlaneDeck } from "#/services/cardProvider";
import { GameType } from "..";
import { EternitiesMapDeckType, EternitiesMapSubType } from "./EternitiesMap";
import { SingleDeck } from "./SingleDeck";

describe("SingleDeck.specs", () => {
	it("returns the type", () => {
		const game = new SingleDeck({
			deckType: EternitiesMapDeckType.PLANES,
			deck: getPlaneDeck(),
			wallStates: new WallManager(),
		});
		expect(game.specs.type).toEqual(GameType.ETERNITIES);
		expect(game.specs.subType).toEqual(EternitiesMapSubType.SINGLE_DECK);
		expect(game.specs.deckType).toEqual(EternitiesMapDeckType.PLANES);
	});
});

describe("SingleDeck.planeswalk", () => {
	it("changes current active plane", () => {
		const game = new SingleDeck({
			deckType: EternitiesMapDeckType.PLANES,
			deck: getPlaneDeck(),
			wallStates: new WallManager(),
		});
		const currentActive = game.active;
		game.planeswalk({ initiator: "foo", coords: { x: 1, y: 0 } });
		expect(game.active).not.toEqual(currentActive);
	});

	it("shifts the board right", () => {
		const game = new SingleDeck({
			deckType: EternitiesMapDeckType.PLANES,
			deck: getPlaneDeck(),
			wallStates: new WallManager(),
		});
		game.planeswalk({ initiator: "foo", coords: { x: 1, y: 0 } });
		expect(game.tiles).toHaveLength(8);
		expect(game.tiles).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ coords: { x: -2, y: 0 } }),
				expect.objectContaining({ coords: { x: -1, y: -1 } }),
				expect.objectContaining({ coords: { x: -1, y: 1 } }),
			]),
		);
	});

	it("shifts the board left", () => {
		const game = new SingleDeck({
			deckType: EternitiesMapDeckType.PLANES,
			deck: getPlaneDeck(),
			wallStates: new WallManager(),
		});
		game.planeswalk({ initiator: "foo", coords: { x: -1, y: 0 } });
		expect(game.tiles).toHaveLength(8);
		expect(game.tiles).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ coords: { x: 2, y: 0 } }),
				expect.objectContaining({ coords: { x: 1, y: 1 } }),
				expect.objectContaining({ coords: { x: 1, y: -1 } }),
			]),
		);
	});

	it("shifts the board up", () => {
		const game = new SingleDeck({
			deckType: EternitiesMapDeckType.PLANES,
			deck: getPlaneDeck(),
			wallStates: new WallManager(),
		});
		game.planeswalk({ initiator: "foo", coords: { x: 0, y: 1 } });
		expect(game.tiles).toHaveLength(8);
		expect(game.tiles).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ coords: { x: 0, y: -2 } }),
				expect.objectContaining({ coords: { x: -1, y: -1 } }),
				expect.objectContaining({ coords: { x: 1, y: -1 } }),
			]),
		);
	});

	it("shifts the board down", () => {
		const game = new SingleDeck({
			deckType: EternitiesMapDeckType.PLANES,
			deck: getPlaneDeck(),
			wallStates: new WallManager(),
		});
		game.planeswalk({ initiator: "foo", coords: { x: 0, y: -1 } });
		expect(game.tiles).toHaveLength(8);
		expect(game.tiles).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ coords: { x: 0, y: 2 } }),
				expect.objectContaining({ coords: { x: -1, y: 1 } }),
				expect.objectContaining({ coords: { x: 1, y: 1 } }),
			]),
		);
	});

	it("cleanup planes that are too far away", () => {
		const game = new SingleDeck({
			deckType: EternitiesMapDeckType.PLANES,
			deck: getPlaneDeck(),
			wallStates: new WallManager(),
		});

		game.planeswalk({ initiator: "foo", coords: { x: 0, y: -1 } });
		expect(game.tiles).toHaveLength(8);
		expect(game.tiles).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ coords: { x: 0, y: 2 } }),
			]),
		);

		game.planeswalk({ initiator: "foo", coords: { x: 0, y: -1 } });
		expect(game.tiles).toHaveLength(11);
		expect(game.tiles).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ coords: { x: 0, y: 3 } }),
			]),
		);

		game.planeswalk({ initiator: "foo", coords: { x: 0, y: -1 } });
		expect(game.tiles).toHaveLength(11);
		expect(game.tiles).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ coords: { x: 0, y: 3 } }),
			]),
		);
	});
});

describe("SingleDeck.export", () => {
	it("exports the state of the map", () => {
		const map = new SingleDeck({
			deckType: EternitiesMapDeckType.PLANES,
			deck: getPlaneDeck(),
			wallStates: new WallManager(),
		});
		const exported = map.export();
		expect(exported.specs.type).toEqual(GameType.ETERNITIES);
		expect(exported.specs.subType).toEqual(EternitiesMapSubType.SINGLE_DECK);
		expect(exported.specs.deckType).toEqual(EternitiesMapDeckType.PLANES);
		expect(exported.deck.cards).toHaveLength(map.remaining);
		expect(exported.deck.played).toHaveLength(map.played.length);
		expect(exported.active).toHaveLength(map.active.length);
		const exportedIds = exported.active.map((exported) => exported.id);
		for (const card of map.active) {
			expect(exportedIds).toContain(card.id);
		}
	});
});
