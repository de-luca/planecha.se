import { describe, expect, it, vi } from "vitest";
import { Phenomenon, Plane } from "#/model/card";
import { StateKey, WallManager } from "#/model/wall";
import { getPhenomenonDeck, getPlaneDeck } from "#/services/cardProvider";
import { GameType } from "../GameInterface";
import { DualDeck, EncounterMechanic } from "./DualDeck";
import { EternitiesMapDeckType, EternitiesMapSubType } from "./EternitiesMap";

describe("DualDeck.specs", () => {
	it("produces expected specs", () => {
		const game = new DualDeck({
			deck: getPlaneDeck(),
			phenomenaDeck: getPhenomenonDeck(),
			deckType: EternitiesMapDeckType.PLANES,
			wallStates: new WallManager(),
			encounterTriggers: {
				ON_HELLRIDE: {
					enabled: true,
					mechanic: EncounterMechanic.AUTO,
					ratio: 1,
				},
				ON_PLANESWALK: {
					enabled: false,
				},
			},
		});
		expect(game.specs.type).toEqual(GameType.ETERNITIES);
		expect(game.specs.subType).toEqual(EternitiesMapSubType.DUAL_DECK);
		expect(game.encounterTriggers.ON_HELLRIDE).toEqual({
			enabled: true,
			mechanic: EncounterMechanic.AUTO,
			ratio: 1,
		});
		expect(game.encounterTriggers.ON_PLANESWALK).toEqual({
			enabled: false,
		});
	});
});

describe("DualDeck.encounter", () => {
	it("uses the phenomena deck on encounter", () => {
		const game = new DualDeck({
			deck: getPlaneDeck(),
			phenomenaDeck: getPhenomenonDeck(),
			deckType: EternitiesMapDeckType.PLANES,
			wallStates: new WallManager(),
			encounterTriggers: {
				ON_HELLRIDE: {
					enabled: true,
					mechanic: EncounterMechanic.AUTO,
					ratio: 1,
				},
				ON_PLANESWALK: {
					enabled: false,
				},
			},
		});

		const phenomenaDeckSize = game.remainingPhenomena;

		game.encounter({ coords: { x: 1, y: 1 }, initiator: "foo" });
		expect(game.destination).toEqual({ x: 1, y: 1 });
		expect(game.remainingPhenomena).toEqual(phenomenaDeckSize - 1);
		expect(game.active).toHaveLength(1);
		expect(game.active[0]).toBeInstanceOf(Phenomenon);
		expect(game.walls.has(StateKey.PHENOMENON_WALL)).toEqual(true);
	});
});

describe("DualDeck.resolve", () => {
	it("resolves the current encounter and planeswalk", () => {
		const game = new DualDeck({
			deck: getPlaneDeck(),
			phenomenaDeck: getPhenomenonDeck(),
			deckType: EternitiesMapDeckType.PLANES,
			wallStates: new WallManager(),
			encounterTriggers: {
				ON_HELLRIDE: {
					enabled: true,
					mechanic: EncounterMechanic.AUTO,
					ratio: 1,
				},
				ON_PLANESWALK: {
					enabled: false,
				},
			},
		});

		game.encounter({ coords: { x: 1, y: 1 }, initiator: "foo" });
		const planeswalkSpy = vi.spyOn(game, "planeswalk");
		const remaining = game.remaining;
		const playedPhenomena = game.playedPhenomena.length;

		game.resolve({ initiator: "foo" });
		expect(game.active).toHaveLength(1);
		expect(game.active[0]).toBeInstanceOf(Plane);
		// planeswalking from 0:0 to 1:1 uses 1 for 1:1 et 2 for each empty sides
		expect(game.remaining).toEqual(remaining - 3);
		expect(game.playedPhenomena.length).toEqual(playedPhenomena + 1);
		expect(planeswalkSpy).toHaveBeenCalled();
	});
});

describe("DualDeck.dump", () => {
	it("dumps the state of the map", () => {
		const game = new DualDeck({
			deck: getPlaneDeck(),
			phenomenaDeck: getPhenomenonDeck(),
			deckType: EternitiesMapDeckType.PLANES,
			wallStates: new WallManager(),
			encounterTriggers: {
				ON_HELLRIDE: {
					enabled: true,
					mechanic: EncounterMechanic.AUTO,
					ratio: 1,
				},
				ON_PLANESWALK: {
					enabled: false,
				},
			},
		});
		const dump = game.dump();
		expect(dump.specs.type).toEqual(GameType.ETERNITIES);
		expect(dump.specs.subType).toEqual(EternitiesMapSubType.DUAL_DECK);
		expect(dump.specs.deckType).toEqual(EternitiesMapDeckType.PLANES);
		expect(dump.deck.cards).toHaveLength(game.remaining);
		expect(dump.deck.played).toHaveLength(game.played.length);
		expect(dump.phenomenaDeck.cards).toHaveLength(game.remainingPhenomena);
		expect(dump.phenomenaDeck.played).toHaveLength(game.playedPhenomena.length);
		expect(dump.active).toHaveLength(game.active.length);
		expect(dump.encounterTriggers).toEqual({
			ON_HELLRIDE: {
				enabled: true,
				mechanic: EncounterMechanic.AUTO,
				ratio: 1,
			},
			ON_PLANESWALK: {
				enabled: false,
			},
		});
		const dumpedIds = dump.active.map((c) => c.id);
		for (const card of game.active) {
			expect(dumpedIds).toContain(card.id);
		}
	});
});
