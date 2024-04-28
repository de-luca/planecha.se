import {
	getCardList,
	getCustomDeck,
	getDeck,
	restoreDeck,
} from "#/services/cardProvider";
import type { Card } from "../card";
import { WallManager } from "../wall";
import { type GameDump, type GameInterface, GameType } from "./GameInterface";
import {
	type EncounterTriggers,
	type EternitiesMapDump,
	type EternitiesMapSpecs,
	build as buildEM,
	restore as restoreEM,
} from "./eternities";
import { Multi } from "./multi/Multi";
import { Single } from "./single/Single";

export interface BuildProps {
	type: GameType;
	cards?: Array<string>;
	specs?: Omit<EternitiesMapSpecs, "type">;
	encounterTriggers?: EncounterTriggers;
}

export const build = (props: BuildProps): GameInterface => {
	switch (props.type) {
		case GameType.SINGLE:
			return new Single({
				wallStates: new WallManager(),
				deck: props.cards ? getCustomDeck(props.cards) : getDeck(),
			});
		case GameType.MULTI:
			return new Multi({
				wallStates: new WallManager(),
				deck: props.cards ? getCustomDeck(props.cards) : getDeck(),
			});
		case GameType.ETERNITIES:
			return buildEM(
				{
					type: props.type,
					...(props.specs as Omit<EternitiesMapSpecs, "type">),
				},
				props.encounterTriggers,
				props.cards,
			);
	}
};

export const restore = (dump: GameDump): GameInterface => {
	switch (dump.specs.type) {
		case GameType.SINGLE:
			return new Single({
				deck: restoreDeck<Card>(dump.deck),
				wallStates: new WallManager(dump.wallStates),
				hasStarted: dump.hasStarted,
				active: getCardList<Card>(dump.active),
				revealed: dump.revealed
					? {
							relevant: getCardList<Card>(dump.revealed.relevant),
							others: getCardList<Card>(dump.revealed.others),
						}
					: undefined,
			});
		case GameType.ETERNITIES:
			return restoreEM(dump as EternitiesMapDump);
		default:
			throw new Error("Incompatible");
	}
};
