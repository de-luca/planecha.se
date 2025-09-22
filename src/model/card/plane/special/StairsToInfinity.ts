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
 * Players have no maximum hand size.
 *
 * Whenever you roll the planar die, draw a card.
 *
 * Whenever you roll {CHAOS}, reveal the top card of your planar deck.
 * You may put it on the bottom of your planar deck.
 */
export class StairsToInfinity extends SpecialPlane {
	public chaos(walls: WallManager, initiator: string): void {
		const revealer: RevealerWall = {
			tagline: "Chaos ensues on",
			title: this.name,
			subTitle:
				"Chose to put this card on top or at the bottom the planar deck.",
			source: RevealerSource.STAIRS_TO_INFINITY,
			component: RevealerMode.SCRY,
			sendShownTo: "bottom",
			initiator,
		};

		walls.set(StateKey.REVEALER, revealer);
		eventBus.emit(EventType.STAIRS_TO_INFINITY);
	}
}
