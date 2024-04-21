import {
	getCardList,
	getCustomDeck,
	getDeck,
	restoreDeck,
} from "#/services/cardProvider";
import type { Card } from "../card";
import { WallManager } from "../wall";
import { type Exported, type GameInterface, GameType } from "./GameInterface";
import {
	type EncounterTriggers,
	type EternitiesMapExported,
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

export const restore = (payload: Exported): GameInterface => {
	switch (payload.specs.type) {
		case GameType.SINGLE:
			return new Single({
				deck: restoreDeck<Card>(payload.deck),
				wallStates: new WallManager(payload.wallStates),
				hasStarted: payload.hasStarted,
				active: getCardList<Card>(payload.active),
				revealed: payload.revealed
					? {
							relevant: getCardList<Card>(payload.revealed.relevant),
							others: getCardList<Card>(payload.revealed.others),
						}
					: undefined,
			});
		case GameType.ETERNITIES:
			return restoreEM(payload as EternitiesMapExported);
		default:
			throw new Error("Incompatible");
	}
};
