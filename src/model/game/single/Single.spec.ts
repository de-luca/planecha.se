import { describe, expect, it } from "vitest";
import { getDeck } from "#/services/cardProvider";
import { GameType, Single } from "..";
import { Plane } from "../../card";
import { WallManager } from "../../wall";

describe("Single.type", () => {
	it("returns the type", () => {
		const game = new Single({
			deck: getDeck(),
			wallStates: new WallManager(),
		});

		expect(game.specs.type).toEqual(GameType.SINGLE);
	});
});

describe("Single.planeswalk", () => {
	it("changes active card", () => {
		const game = new Single({
			deck: getDeck(),
			wallStates: new WallManager(),
		});
		const startCard = game.active;
		const deckSize = game.remaining;
		const playedSize = game.played.length;

		game.planeswalk({ initiator: "foo" });

		expect(game.active).not.toEqual(startCard);
		expect(game.remaining).toBeLessThan(deckSize);
		expect(game.played.length).toBeGreaterThan(playedSize);
	});

	it("changes active card to given planes", () => {
		const game = new Single({
			deck: getDeck(),
			wallStates: new WallManager(),
		});
		const startCard = game.active;
		const deckSize = game.remaining;
		const playedSize = game.played.length;

		game.revealUntil({ count: 2, type: Plane });
		game.planeswalk({
			initiator: "foo",
			planes: game.revealed?.relevant as Array<Plane>,
		});
		game.resolveReveal({
			top: [],
			bottom: game.revealed?.others ?? [],
		});

		expect(game.active).not.toEqual(startCard);
		expect(game.active).toHaveLength(2);
		expect(game.remaining).toBeLessThan(deckSize);
		expect(game.played.length).toBeGreaterThan(playedSize);
	});
});
