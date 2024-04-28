import type { Card, Plane } from "#/model/card";
import type { Deck } from "#/model/deck/Deck";
import { WallManager } from "#/model/wall";
import {
	getCardList,
	getCustomDeck,
	getDeck,
	getPhenomenonDeck,
	getPlaneDeck,
	restoreDeck,
} from "#/services/cardProvider";
import type { GameInterface } from "../GameInterface";
import {
	DualDeck,
	type DualDeckDump,
	type EncounterTriggers,
} from "./DualDeck";
import {
	EternitiesMapDeckType,
	type EternitiesMapDump,
	type EternitiesMapSpecs,
	EternitiesMapSubType,
} from "./EternitiesMap";
import {
	SingleDeck,
	type SingleDeckDump,
	type SingleDeckProps,
} from "./SingleDeck";
import { Tile } from "./Tile";

export const build = (
	specs: EternitiesMapSpecs,
	encounterTriggers?: EncounterTriggers,
	cards?: Array<string>,
): GameInterface => {
	const deck = buildDeck(specs, cards);
	const state = new WallManager();

	if (specs.subType === EternitiesMapSubType.SINGLE_DECK) {
		return new SingleDeck({
			deck,
			wallStates: state,
			deckType: specs.deckType,
		});
	}

	return new DualDeck({
		deck,
		wallStates: state,
		deckType: EternitiesMapDeckType.PLANES,
		phenomenaDeck: getPhenomenonDeck(),
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
		active: getCardList<Plane>(dump.active),
		revealed: dump.revealed
			? {
					relevant: getCardList<Card>(dump.revealed.relevant),
					others: getCardList<Card>(dump.revealed.others),
				}
			: undefined,
		tiles: dump.tiles?.map(Tile.fromDump),
	};

	if (specs.subType === EternitiesMapSubType.SINGLE_DECK) {
		return new SingleDeck({
			...props,
			destination: (dump as SingleDeckDump).destination,
		});
	}

	return new DualDeck({
		...props,
		deckType: EternitiesMapDeckType.PLANES,
		phenomenaDeck: restoreDeck((dump as DualDeckDump).phenomenaDeck),
		encounterTriggers: (dump as DualDeckDump).encounterTriggers,
	});
};

const buildDeck = (
	specs: EternitiesMapSpecs,
	cards?: Array<string>,
): Deck<Card> => {
	switch (true) {
		case cards !== undefined:
			return getCustomDeck(cards as Array<string>);
		case specs.subType === EternitiesMapSubType.DUAL_DECK:
			return getPlaneDeck();
		case specs.deckType === EternitiesMapDeckType.ALL:
			return getDeck();
		default:
			return getPlaneDeck();
	}
};
