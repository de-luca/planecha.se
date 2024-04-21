import { describe, expect, it } from "vitest";
import { WallManager } from "#/model/wall";
import { CardProvider } from "#/services/cardProvider";
import { MapType } from "..";
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
			type: MapType.ETERNITIES,
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
		const map = new TestMap({
			deck: CardProvider.getDeck(),
			wallStates: new WallManager(),
			deckType: EternitiesMapDeckType.ALL,
		});
		expect(map.tiles).toHaveLength(5);
	});
});
