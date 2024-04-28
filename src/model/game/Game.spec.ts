import { diff } from "@n1ru4l/json-patch-plus";
import { describe, expect, it, vi } from "vitest";
import { getDeck, getPlaneDeck } from "#/services/cardProvider";
import { eventBus } from "#/services/eventBus";
import type { Patch } from "#/utils/delta";
import { Game, type GameSpecs, GameType } from ".";
import { Card, Plane } from "../card";
import type { Deck } from "../deck/Deck";
import { WallManager } from "../wall";

class TestGame extends Game {
	public get specs(): GameSpecs {
		return { type: GameType.SINGLE };
	}
	public testActive(): void {
		this._active = [this._deck.draw()];
	}
	public getDeck(): Deck<Card> {
		return this._deck;
	}

	public planeswalk(): boolean {
		throw new Error("Method not implemented.");
	}
	public addActivePlane(): boolean {
		throw new Error("Method not implemented.");
	}
	public customPlaneswalk(): void {
		throw new Error("Method not implemented.");
	}
	public resolve(): boolean {
		throw new Error("Method not implemented.");
	}
}

describe("Game.ready", () => {
	it("resolves", async () => {
		const game = new TestGame({
			deck: getDeck(),
			wallStates: new WallManager(),
		});

		let ready = false;
		try {
			await game.ready;
			ready = true;
		} catch (e) {}

		expect(ready).toEqual(true);
	});
});

describe("Game.chaos", () => {
	it("triggers chaos", () => {
		const game = new TestGame({
			deck: getDeck(),
			wallStates: new WallManager(),
		});
		game.testActive();
		for (const card of game.active) {
			card.chaos = vi.fn();
		}
		game.chaos({ card: game.active[0], initiator: "foo" });
		expect(game.active[0].chaos).toHaveBeenCalled();
	});
});

describe("Game.updateCounter", () => {
	it("updates card counters", () => {
		const game = new TestGame({
			deck: getPlaneDeck(),
			wallStates: new WallManager(),
		});
		game.testActive();
		for (const card of game.active)
			if (card instanceof Plane) {
				card.updateCounter = vi.fn();
			}
		game.updateCounter({ planeId: game.active[0].id, change: 1 });
		expect((game.active[0] as Plane).updateCounter).toHaveBeenCalled();
	});
});

describe("Game.revealUntil", () => {
	it("reveals a given number of requested Card", () => {
		const game = new TestGame({
			deck: getDeck(),
			wallStates: new WallManager(),
		});
		game.revealUntil({ count: 2 });
		expect(game.revealed?.relevant).toHaveLength(2);
		expect(game.revealed?.others).toHaveLength(0);
		for (const card of game.revealed?.relevant ?? []) {
			expect(card).toBeInstanceOf(Card);
		}
	});
});

describe("Game.resolveReveal", () => {
	it("puts back cards on top and bottom", () => {
		const game = new TestGame({
			deck: getDeck(),
			wallStates: new WallManager(),
		});

		const putOnTop = vi.spyOn(game.getDeck(), "putOnTop");
		const putOnTheBottom = vi.spyOn(game.getDeck(), "putOnTheBottom");
		eventBus.emit = vi.fn();

		game.revealUntil({ count: 2 });
		const top = game.revealed?.relevant[0] as Card;
		const bottom = game.revealed?.relevant[1] as Card;
		game.resolveReveal({ top: [top], bottom: [bottom] });
		expect(putOnTop).toHaveBeenCalled();
		expect(putOnTheBottom).toHaveBeenCalled();

		const dumpedDeck = game.getDeck().dump();
		expect(dumpedDeck.cards[0]).toEqual(top.dump());
		expect(dumpedDeck.cards[game.remaining - 1]).toEqual(bottom.dump());
		expect(game.revealed).toBeUndefined();
	});
});

describe("Game.export", () => {
	it("exports the state of the game", () => {
		const game = new TestGame({
			deck: getDeck(),
			wallStates: new WallManager(),
		});
		const dump = game.dump();
		expect(dump.specs.type).toEqual(GameType.SINGLE);
		expect(dump.deck.cards).toHaveLength(game.remaining);
		expect(dump.deck.played).toHaveLength(game.played.length);
		expect(dump.active).toHaveLength(game.active.length);
		for (const card of game.active) {
			expect(dump.active).toContain(card.id);
		}
	});
});

describe("Game.apply", () => {
	it("applies patch the states of the game", () => {
		const game = new TestGame({
			deck: getDeck(),
			wallStates: new WallManager(),
		});

		// Get a base state
		const base = game.dump();

		// Do actions to modify the state
		game.start();
		game.testActive();

		// Get the new state
		const updated = game.dump();

		// Get the delta between version
		// Swap left/right to go back to the base
		const delta = diff({ left: updated, right: base });

		const patch: Patch = {
			event: "test",
			delta,
		};

		// Apply the patch to go back to the base
		game.apply(patch, "testPeer");

		expect(game.dump()).toEqual(base);
	});
});
