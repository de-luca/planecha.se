import { RevealerMode, RevealerSource } from '@/model/state/Revealer';
import { State } from '@/model/state/State';
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
  public enter(state: State, { passive = false, initiator }: Passivity = {}): void {
    state.openRevealer({
      source: RevealerSource.SPACIAL_MERGING,
      component: RevealerMode.SHOW,
      sendShownTo: 'top',
      passive,
      initiator,
    });
  }
}
