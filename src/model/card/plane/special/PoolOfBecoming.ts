import { eventBus, EventType } from '@/services/EventBus';
import { Plane } from '../Plane';

/**
 * At the beginning of your end step, put the cards in your hand
 * on the bottom of your library in any order, then draw that many cards.
 *
 * Whenever you roll {CHAOS}, reveal the top three cards of your planar deck.
 * Each of the revealed cards’ {CHAOS} abilities triggers.
 * Then put the revealed cards on the bottom of your planar deck in any order.
 */
export class PoolOfBecoming extends Plane {
  public chaos({ passive = false, initiator }: Passivity = {}): void {
    eventBus.emit(EventType.POOL_OF_BECOMING, { passive, initiator });
  }
}
