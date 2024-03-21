import { Plane } from '../Plane';
import { eventBus, EventType } from '#/services/EventBus';
import {
  WallManager,
  RevealerMode,
  RevealerSource,
  RevealerWall,
  StateKey,
} from '#/model/wall';

/**
 * At the beginning of your end step, put the cards in your hand
 * on the bottom of your library in any order, then draw that many cards.
 *
 * Whenever you roll {CHAOS}, reveal the top three cards of your planar deck.
 * Each of the revealed cards’ {CHAOS} abilities triggers.
 * Then put the revealed cards on the bottom of your planar deck in any order.
 */
export class PoolsOfBecoming extends Plane {
  public get chaosRequireInterraction(): boolean {
    return true;
  }

  public chaos(walls: WallManager, initiator: string): void {
    const revealer: RevealerWall = {
      title: this.name,
      subTitle: 'Chaos from these cards will trigger.',
      source: RevealerSource.POOLS_OF_BECOMING,
      component: RevealerMode.SHOW,
      sendShownTo: 'bottom',
      initiator,
    };

    walls.set(StateKey.REVEALER, revealer);
    eventBus.emit(EventType.POOLS_OF_BECOMING);
  }
}
