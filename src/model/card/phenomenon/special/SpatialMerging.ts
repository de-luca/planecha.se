import { Revealer, RevealerMode, RevealerSource } from '@/model/state/Revealer';
import { MapState, StateKey } from '@/model/state/MapState';
import { Phenomenon } from '../Phenomenon';

/**
 * When you encounter Spatial Merging,
 * reveal cards from the top of your planar deck
 * until you reveal two plane cards.
 * Simultaneously planeswalk to both of them.
 * Put all other cards revealed this way on the
 * bottom of your planar deck in any order.
 */
export class SpatialMerging extends Phenomenon {
  public enter(state: MapState, { passive = false, initiator }: Passivity = {}): void {
    const revealer: Revealer = {
      source: RevealerSource.SPACIAL_MERGING,
      component: RevealerMode.SHOW,
      sendShownTo: 'top',
      passive,
      initiator,
    };

    state.set(StateKey.REVEALER, revealer);
  }
}
