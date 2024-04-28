import { describe, expect, it } from "vitest";
import { getCard } from "#/services/cardProvider";
import { Tile, TileStatus } from "./Tile";

const cardId = "15b979de-c8ee-4664-9ca7-6c4eb3346967";

describe("Tile.fromDump", () => {
	it("returns a tile from a dump payload", () => {
		const tile = Tile.fromDump({
			coords: { x: 1, y: 0 },
			state: TileStatus.ACTIVE,
			plane: [{ id: cardId, counters: undefined }],
		});

		expect(tile.coords).toEqual({ x: 1, y: 0 });
		expect(tile.state).toEqual(TileStatus.ACTIVE);
		expect(tile.plane).toHaveLength(1);
		expect(tile.plane[0].id).toEqual(cardId);
	});
});

describe("Tile.dump", () => {
	it("returns a dumped Tile", () => {
		const tile = new Tile({ x: 1, y: 0 }, TileStatus.ACTIVE, [getCard(cardId)]);

		expect(tile.dump()).toEqual({
			coords: { x: 1, y: 0 },
			state: "active",
			plane: [{ id: cardId, counters: undefined }],
		});
	});
});
