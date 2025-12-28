import type { Card, Plane } from "@/model/card";
import { WallManager } from "@/model/wall";
import {
	getDeckFromList,
	getList,
	getSplitDeckFromList,
	restoreDeck,
} from "@/services/deckProvider";
import type { GameInterface } from "../GameInterface";
import {
	DualDeck,
	type DualDeckDump,
	type EncounterTriggers,
} from "./DualDeck";
import type { EternitiesMapDump, EternitiesMapSpecs } from "./EternitiesMap";
import {
	SingleDeck,
	type SingleDeckDump,
	type SingleDeckProps,
} from "./SingleDeck";
import { Tile } from "./Tile";

export const build = (
	specs: EternitiesMapSpecs,
	cards: Array<string>,
	encounterTriggers?: EncounterTriggers,
): GameInterface => {
	const state = new WallManager();

	if (specs.subType === "single") {
		return new SingleDeck({
			deck: getDeckFromList(cards),
			wallStates: state,
			deckType: specs.deckType,
		});
	}

	const decks = getSplitDeckFromList(cards);
	return new DualDeck({
		deck: decks.plane,
		wallStates: state,
		deckType: "planes",
		phenomenaDeck: decks.phenomenon,
		encounterTriggers: encounterTriggers as EncounterTriggers,
	});
};

export const restore = (dump: EternitiesMapDump): GameInterface => {
	const specs = dump.specs as EternitiesMapSpecs;
	const props: SingleDeckProps = {
		wallStates: new WallManager(dump.wallStates),
		hasStarted: dump.hasStarted,
		deckType: specs.deckType,
		deck: restoreDeck<Plane>(dump.deck),
		active: getList<Plane>(dump.active),
		revealed: dump.revealed
			? {
					relevant: getList<Card>(dump.revealed.relevant),
					others: getList<Card>(dump.revealed.others),
				}
			: undefined,
		tiles: dump.tiles?.map(Tile.fromDump),
	};

	if (specs.subType === "single") {
		return new SingleDeck({
			...props,
			destination: (dump as SingleDeckDump).destination,
		});
	}

	return new DualDeck({
		...props,
		deckType: "planes",
		phenomenaDeck: restoreDeck((dump as DualDeckDump).phenomenaDeck),
		encounterTriggers: (dump as DualDeckDump).encounterTriggers,
	});
};
