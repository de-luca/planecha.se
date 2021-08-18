import { Phenomenon } from '../Phenomenon';
import {
  MapStates,
  RevealerMode,
  RevealerSource,
  RevealerWallState,
  StateKey,
} from '@/model/states';

/**
 * When you encounter Spatial Merging,
 * reveal cards from the top of your planar deck
 * until you reveal two plane cards.
 * Simultaneously planeswalk to both of them.
 * Put all other cards revealed this way on the
 * bottom of your planar deck in any order.
 */
export class SpatialMerging extends Phenomenon {
  public enter(states: MapStates, { passive = false, initiator }: Passivity = {}): void {
    const revealer: RevealerWallState = {
      source: RevealerSource.SPACIAL_MERGING,
      component: RevealerMode.SHOW,
      sendShownTo: 'top',
      passive,
      initiator,
    };

    states.set(StateKey.REVEALER, revealer);
  }
}
