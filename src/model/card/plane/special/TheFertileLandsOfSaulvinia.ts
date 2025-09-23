import {
	RevealerMode,
	RevealerSource,
	type RevealerWall,
	StateKey,
	type WallManager,
} from "@/model/wall";
import { EventType, eventBus } from "@/services/eventBus";
import { SpecialPlane } from "./SpecialPlane";

/**
 * Whenever a player taps a land for mana,
 * that player adds one mana of any type that land produced.
 *
 * Whenever chaos ensues, reveal cards from the top of your
 * planar deck until you reveal a plane card.
 * Chaos ensues on that plane.
 * Then put all cards revealed this way on the bottom of
 * your planar deck in any order.
 */
export class TheFertileLandsOfSaulvinia extends SpecialPlane {
	public chaos(walls: WallManager, initiator: string): void {
		const revealer: RevealerWall = {
			tagline: "Chaos ensues on",
			title: this.name,
			subTitle: "Chaos from this plane will trigger.",
			source: RevealerSource.THE_FERTILE_LANDS_OF_SAULVINIA,
			component: RevealerMode.SHOW,
			sendShownTo: "top",
			initiator,
		};

		walls.set(StateKey.REVEALER, revealer);
		eventBus.emit(EventType.THE_FERTILE_LANDS_OF_SAULVINIA);
	}
}
