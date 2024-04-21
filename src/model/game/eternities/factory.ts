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
	type DualDeckExported,
	type EncounterTriggers,
} from "./DualDeck";
import {
	EternitiesMapDeckType,
	type EternitiesMapExported,
	type EternitiesMapSpecs,
	EternitiesMapSubType,
} from "./EternitiesMap";
import {
	SingleDeck,
	type SingleDeckExported,
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

export const restore = (payload: EternitiesMapExported): GameInterface => {
	const specs = payload.specs as EternitiesMapSpecs;
	const props: SingleDeckProps = {
		wallStates: new WallManager(payload.wallStates),
		hasStarted: payload.hasStarted,
		deckType: specs.deckType,
		deck: restoreDeck<Plane>(payload.deck),
		active: getCardList<Plane>(payload.active),
		revealed: payload.revealed
			? {
					relevant: getCardList<Card>(payload.revealed.relevant),
					others: getCardList<Card>(payload.revealed.others),
				}
			: undefined,
		tiles: payload.tiles?.map(Tile.fromExport),
	};

	if (specs.subType === EternitiesMapSubType.SINGLE_DECK) {
		return new SingleDeck({
			...props,
			destination: (payload as SingleDeckExported).destination,
		});
	}

	return new DualDeck({
		...props,
		deckType: EternitiesMapDeckType.PLANES,
		phenomenaDeck: restoreDeck((payload as DualDeckExported).phenomenaDeck),
		encounterTriggers: (payload as DualDeckExported).encounterTriggers,
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
