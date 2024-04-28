import { describe, expect, it } from "vitest";
import { type GameDump, GameType, Single } from ".";
import {
	DualDeck,
	type DualDeckDump,
	EncounterMechanic,
	EncounterTrigger,
	EternitiesMapDeckType,
	EternitiesMapSubType,
	SingleDeck,
	type SingleDeckDump,
	TileStatus,
} from "./eternities";
import { build, restore } from "./factory";

describe("build", () => {
	it("creates a Single deck Game", () => {
		const game = build({
			type: GameType.SINGLE,
		});

		expect(game).toBeInstanceOf(Single);
	});

	it("creates an EternitesMap with SingleDeck", async () => {
		const game = build({
			type: GameType.ETERNITIES,
			specs: {
				subType: EternitiesMapSubType.SINGLE_DECK,
				deckType: EternitiesMapDeckType.PLANES,
			},
		});

		expect(game).toBeInstanceOf(SingleDeck);
	});

	it("creates an EternitesMap with DualDeck", async () => {
		const game = build({
			type: GameType.ETERNITIES,
			specs: {
				subType: EternitiesMapSubType.DUAL_DECK,
				deckType: EternitiesMapDeckType.PLANES,
			},
		});

		expect(game).toBeInstanceOf(DualDeck);
	});
});

describe("restore", () => {
	it("restores a Single deck Game", () => {
		const dump: GameDump = {
			wallStates: {},
			hasStarted: true,
			deck: {
				cards: [
					{ id: "15b979de-c8ee-4664-9ca7-6c4eb3346967" },
					{ id: "38f84e55-049c-441e-b4e2-1e207ab5dbe5" },
					{ id: "25650a32-4014-4065-ad01-7357c3ad3995" },
					{ id: "d6ab4159-e04e-4991-8a9b-9da302c98e9d" },
					{ id: "805f9dc2-e172-481d-bae7-9a136a3d1e49" },
				],
				played: [],
			},
			active: [
				{
					id: "82e67c57-6d7a-44cc-ba63-77ce887ab075",
				},
			],
			specs: {
				type: GameType.SINGLE,
			},
		};

		const game = restore(dump);
		expect(game).toBeInstanceOf(Single);
	});

	it("restores an EternitesMap with SingleDeck", () => {
		const dump: SingleDeckDump = {
			wallStates: {},
			hasStarted: true,
			deck: {
				cards: [
					{ id: "15b979de-c8ee-4664-9ca7-6c4eb3346967" },
					{ id: "38f84e55-049c-441e-b4e2-1e207ab5dbe5" },
					{ id: "25650a32-4014-4065-ad01-7357c3ad3995" },
					{ id: "d6ab4159-e04e-4991-8a9b-9da302c98e9d" },
					{ id: "805f9dc2-e172-481d-bae7-9a136a3d1e49" },
				],
				played: [],
			},
			active: [
				{
					id: "82e67c57-6d7a-44cc-ba63-77ce887ab075",
				},
			],
			specs: {
				type: GameType.ETERNITIES,
				subType: EternitiesMapSubType.SINGLE_DECK,
				deckType: EternitiesMapDeckType.PLANES,
			},
			tiles: [
				{
					coords: { x: 0, y: 0 },
					state: TileStatus.ACTIVE,
					plane: [
						{
							id: "82e67c57-6d7a-44cc-ba63-77ce887ab075",
						},
					],
				},
			],
		};

		const game = restore(dump);
		expect(game).toBeInstanceOf(SingleDeck);
	});

	it("restores an EternitesMap with DualDeck", () => {
		const dump: DualDeckDump = {
			wallStates: {},
			hasStarted: true,
			deck: {
				cards: [
					{ id: "15b979de-c8ee-4664-9ca7-6c4eb3346967" },
					{ id: "38f84e55-049c-441e-b4e2-1e207ab5dbe5" },
					{ id: "25650a32-4014-4065-ad01-7357c3ad3995" },
					{ id: "d6ab4159-e04e-4991-8a9b-9da302c98e9d" },
					{ id: "805f9dc2-e172-481d-bae7-9a136a3d1e49" },
				],
				played: [],
			},
			active: [
				{
					id: "82e67c57-6d7a-44cc-ba63-77ce887ab075",
				},
			],
			specs: {
				type: GameType.ETERNITIES,
				subType: EternitiesMapSubType.DUAL_DECK,
				deckType: EternitiesMapDeckType.ALL,
			},
			tiles: [
				{
					coords: { x: 0, y: 0 },
					state: TileStatus.ACTIVE,
					plane: [
						{
							id: "82e67c57-6d7a-44cc-ba63-77ce887ab075",
						},
					],
				},
			],
			phenomenaDeck: {
				cards: [
					{ id: "6dc67a65-31bf-4535-9e02-8f6d6ecefde5" },
					{ id: "7812174b-2dc1-43e8-b98f-639905e20ab7" },
				],
				played: [],
			},
			encounterTriggers: {
				[EncounterTrigger.ON_HELLRIDE]: {
					enabled: true,
					mechanic: EncounterMechanic.AUTO,
					ratio: 1,
				},
				[EncounterTrigger.ON_PLANESWALK]: {
					enabled: true,
					mechanic: EncounterMechanic.AUTO,
					ratio: 1 / 6,
				},
			},
		};

		const game = restore(dump);
		expect(game).toBeInstanceOf(DualDeck);
	});
});
