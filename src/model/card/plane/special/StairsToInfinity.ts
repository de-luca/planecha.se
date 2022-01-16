import { eventBus, EventType } from '@/services/EventBus';
import { Plane } from '../Plane';
import {
  WallStates,
  RevealerMode,
  RevealerSource,
  RevealerWallState,
  StateKey,
} from '@/model/wall';

/**
 * Players have no maximum hand size.
 *
 * Whenever you roll the planar die, draw a card.
 *
 * Whenever you roll {CHAOS}, reveal the top card of your planar deck.
 * You may put it on the bottom of your planar deck.
 */
export class StairsToInfinity extends Plane {
  public chaos(walls: WallStates, { passive = false, initiator }: Passivity = {}): void {
    const revealer: RevealerWallState = {
      title: this.name,
      source: RevealerSource.STAIRS_TO_INFINITY,
      component: RevealerMode.SCRY,
      sendShownTo: 'bottom',
      passive,
      initiator,
    };

    walls.set(StateKey.REVEALER, revealer);

    if (!passive) {
      eventBus.emit(EventType.STAIRS_TO_INFINITY);
    }
  }
}
