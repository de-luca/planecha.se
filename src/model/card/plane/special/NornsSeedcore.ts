import { Plane } from '../Plane';
import { eventBus, EventType } from '#/services/EventBus';
import {
  WallStates,
  RevealerMode,
  RevealerSource,
  RevealerWallState,
  StateKey,
} from '#/model/wall';

/**
 * When you planeswalk to Norn’s Seedcore, chaos ensues.
 *
 * Whenever chaos ensues, reveal cards from the top of your
 * planar deck until you reveal a plane card. Planeswalk to it,
 * except don’t planeswalk away from any plane.
 * Put the rest of the revealed cards on the bottom of your planar deck in any order.
 */
export class NornsSeedcore extends Plane {
  public override get chaosRequireInterraction(): boolean {
    return true;
  }

  public chaos(walls: WallStates, initiator: string): void {
    const revealer: RevealerWallState = {
      title: this.name,
      subTitle: 'You\'ll planeswalk to this plane.',
      source: RevealerSource.NORNS_SEEDCORE,
      component: RevealerMode.SHOW,
      sendShownTo: 'top',
      initiator,
    };

    walls.set(StateKey.REVEALER, revealer);
    eventBus.emit(EventType.NORNS_SEEDCORE);
  }
}
