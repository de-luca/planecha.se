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
 * At the beginning of your end step, put the cards in your hand
 * on the bottom of your library in any order, then draw that many cards.
 *
 * Whenever you roll {CHAOS}, reveal the top three cards of your planar deck.
 * Each of the revealed cards’ {CHAOS} abilities triggers.
 * Then put the revealed cards on the bottom of your planar deck in any order.
 */
export class PoolOfBecoming extends Plane {
  public chaos(walls: WallStates, initiator?: string): void {
    const revealer: RevealerWallState = {
      title: this.name,
      subTitle: 'Chaos from these cards will trigger.',
      source: RevealerSource.POOL_OF_BECOMING,
      component: RevealerMode.SHOW,
      sendShownTo: 'bottom',
      initiator,
    };

    walls.set(StateKey.REVEALER, revealer);

    if (!initiator) {
      eventBus.emit(EventType.POOL_OF_BECOMING);
    }
  }
}
