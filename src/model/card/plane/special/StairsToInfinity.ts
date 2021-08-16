import { Revealer, RevealerMode, RevealerSource } from '@/model/state/Revealer';
import { MapState, StateKey } from '@/model/state/MapState';
import { eventBus, EventType } from '@/services/EventBus';
import { Plane } from '../Plane';

/**
 * Players have no maximum hand size.
 *
 * Whenever you roll the planar die, draw a card.
 *
 * Whenever you roll {CHAOS}, reveal the top card of your planar deck.
 * You may put it on the bottom of your planar deck.
 */
export class StairsToInfinity extends Plane {
  public chaos(state: MapState, { passive = false, initiator }: Passivity = {}): void {
    const revealer: Revealer = {
      source: RevealerSource.STAIRS_TO_INFINITY,
      component: RevealerMode.SCRY,
      sendShownTo: 'bottom',
      passive,
      initiator,
    };

    state.set(StateKey.REVEALER, revealer);

    if (!passive) {
      eventBus.emit(EventType.STAIRS_TO_INFINITY);
    }
  }
}
