import {
	RevealerMode,
	RevealerSource,
	type RevealerWall,
	StateKey,
	type WallManager,
} from "#/model/wall";
import { Phenomenon } from "../Phenomenon";

/**
 * When you encounter Interplanar Tunnel,
 * reveal cards from the top of your planar deck until
 * you reveal five plane cards.
 * Put a plane card from among them on top of your planar deck,
 * then put the rest of the revealed cards on the bottom
 * in a random order.
 */
export class InterplanarTunnel extends Phenomenon {
	public enter(walls: WallManager, initiator: string): void {
		const revealer: RevealerWall = {
			title: this.name,
			subTitle: "Chose a plane to put on top the planar deck.",
			source: RevealerSource.INTERPLANAR_TUNNEL,
			component: RevealerMode.PICK,
			sendShownTo: "top",
			initiator,
		};

		walls.set(StateKey.REVEALER, revealer);
	}
}
