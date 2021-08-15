import { RevealerMode, RevealerSource } from '@/model/state/Revealer';
import { State } from '@/model/state/State';
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
  public chaos(state: State, { passive = false, initiator }: Passivity = {}): void {
    state.openRevealer({
      source: RevealerSource.POOL_OF_BECOMING,
      component: RevealerMode.SHOW,
      sendShownTo: 'bottom',
      passive,
      initiator,
    });

    if (!passive) {
      eventBus.emit(EventType.POOL_OF_BECOMING);
    }
  }
}
