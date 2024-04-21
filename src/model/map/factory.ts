import {
	getCardList,
	getCustomDeck,
	getDeck,
	restoreDeck,
} from "#/services/cardProvider";
import type { Card } from "../card";
import { WallManager } from "../wall";
import { type Exported, type MapInterface, MapType } from "./MapInterface";
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
	type: MapType;
	cards?: Array<string>;
	specs?: Omit<EternitiesMapSpecs, "type">;
	encounterTriggers?: EncounterTriggers;
}

export const build = (props: BuildProps): MapInterface => {
	switch (props.type) {
		case MapType.SINGLE:
			return new Single({
				wallStates: new WallManager(),
				deck: props.cards ? getCustomDeck(props.cards) : getDeck(),
			});
		case MapType.MULTI:
			return new Multi({
				wallStates: new WallManager(),
				deck: props.cards ? getCustomDeck(props.cards) : getDeck(),
			});
		case MapType.ETERNITIES:
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

export const restore = (payload: Exported): MapInterface => {
	switch (payload.specs.type) {
		case MapType.SINGLE:
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
		case MapType.ETERNITIES:
			return restoreEM(payload as EternitiesMapExported);
		default:
			throw new Error("Incompatible");
	}
};
