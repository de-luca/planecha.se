import {
	RevealerMode,
	RevealerSource,
	type RevealerWall,
	StateKey,
	type WallManager,
} from "#/model/wall";
import { EventType, eventBus } from "#/services/eventBus";
import { Plane } from "../Plane";

/**
 * Players have no maximum hand size.
 *
 * Whenever you roll the planar die, draw a card.
 *
 * Whenever you roll {CHAOS}, reveal the top card of your planar deck.
 * You may put it on the bottom of your planar deck.
 */
export class StairsToInfinity extends Plane {
	public override get chaosRequireInterraction(): boolean {
		return true;
	}

	public chaos(walls: WallManager, initiator: string): void {
		const revealer: RevealerWall = {
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
