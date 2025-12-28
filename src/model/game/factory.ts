import { getDeckFromList, getList, restoreDeck } from "@/services/deckProvider";
import type { Card } from "../card";
import { WallManager } from "../wall";
import {
	build as buildEM,
	type EncounterTriggers,
	type EternitiesMapDump,
	type EternitiesMapSpecs,
	restore as restoreEM,
} from "./eternities";
import type { GameDump, GameInterface, GameType } from "./GameInterface";
import { Multi } from "./multi";
import { Single } from "./single";

export type BuildProps = {
	type: GameType;
	cards: Array<string>;
	specs?: Omit<EternitiesMapSpecs, "type">;
	encounterTriggers?: EncounterTriggers;
};

export const build = (props: BuildProps): GameInterface => {
	switch (props.type) {
		case "single":
			return new Single({
				wallStates: new WallManager(),
				deck: getDeckFromList(props.cards),
			});
		case "multi":
			return new Multi({
				wallStates: new WallManager(),
				deck: getDeckFromList(props.cards),
			});
		case "eternities":
			return buildEM(
				{
					type: props.type,
					...(props.specs as Omit<EternitiesMapSpecs, "type">),
				},
				props.cards,
				props.encounterTriggers,
			);
	}
};

export const restore = (dump: GameDump): GameInterface => {
	switch (dump.specs.type) {
		case "single":
			return new Single({
				deck: restoreDeck<Card>(dump.deck),
				wallStates: new WallManager(dump.wallStates),
				hasStarted: dump.hasStarted,
				active: getList<Card>(dump.active),
				revealed: dump.revealed
					? {
							relevant: getList<Card>(dump.revealed.relevant),
							others: getList<Card>(dump.revealed.others),
						}
					: undefined,
			});
		case "eternities":
			return restoreEM(dump as EternitiesMapDump);
		default:
			throw new Error("Incompatible");
	}
};
