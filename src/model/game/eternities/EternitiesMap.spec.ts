import { describe, expect, it } from "vitest";
import { WallManager } from "#/model/wall";
import { getDeck } from "#/services/cardProvider";
import { GameType } from "..";
import {
	EternitiesMap,
	EternitiesMapDeckType,
	type EternitiesMapSpecs,
	EternitiesMapSubType,
} from "./EternitiesMap";

class TestMap extends EternitiesMap {
	public get specs(): EternitiesMapSpecs {
		return {
			deckType: EternitiesMapDeckType.ALL,
			subType: EternitiesMapSubType.SINGLE_DECK,
			type: GameType.ETERNITIES,
		};
	}
	public planeswalk(): void {
		throw new Error("Method not implemented.");
	}
	public addActivePlane(): boolean {
		throw new Error("Method not implemented.");
	}
	public resolve(): void {
		throw new Error("Method not implemented.");
	}
}

describe("EternitiesMap.initializeTiles", () => {
	it("initializes board tiles", () => {
		const game = new TestMap({
			deck: getDeck(),
			wallStates: new WallManager(),
			deckType: EternitiesMapDeckType.ALL,
		});
		expect(game.tiles).toHaveLength(5);
	});
});
