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
  public chaos({ passive = false, initiator }: Passivity = {}): void {
    eventBus.emit(EventType.STAIRS_TO_INFINITY, { passive, initiator });
  }
}
