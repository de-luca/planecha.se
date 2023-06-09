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
 * Whenever a player taps a land for mana,
 * that player adds one mana of any type that land produced.
 *
 * Whenever chaos ensues, reveal cards from the top of your
 * planar deck until you reveal a plane card.
 * Chaos ensues on that plane.
 * Then put all cards revealed this way on the bottom of
 * your planar deck in any order.
 */
export class TheFertileLandsOfSaulvinia extends Plane {
  public override get chaosRequireInterraction(): boolean {
    return true;
  }

  public chaos(walls: WallStates, initiator: string): void {
    const revealer: RevealerWallState = {
      title: this.name,
      subTitle: 'Chaos from this plane will trigger.',
      source: RevealerSource.THE_FERTILE_LANDS_OF_SAULVINIA,
      component: RevealerMode.SHOW,
      sendShownTo: 'top',
      initiator,
    };

    walls.set(StateKey.REVEALER, revealer);
    eventBus.emit(EventType.THE_FERTILE_LANDS_OF_SAULVINIA);
  }
}
