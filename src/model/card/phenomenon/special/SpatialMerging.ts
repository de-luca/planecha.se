import { Phenomenon } from '../Phenomenon';
import {
  WallManager,
  RevealerMode,
  RevealerSource,
  RevealerWall,
  StateKey,
} from '#/model/wall';

/**
 * When you encounter Spatial Merging,
 * reveal cards from the top of your planar deck
 * until you reveal two plane cards.
 * Simultaneously planeswalk to both of them.
 * Put all other cards revealed this way on the
 * bottom of your planar deck in any order.
 */
export class SpatialMerging extends Phenomenon {
  public enter(walls: WallManager, initiator: string): void {
    const revealer: RevealerWall = {
      title: this.name,
      subTitle: 'You\'ll planeswalk to these two planes simultaneously.',
      source: RevealerSource.SPACIAL_MERGING,
      component: RevealerMode.SHOW,
      sendShownTo: 'top',
      initiator,
    };

    walls.set(StateKey.REVEALER, revealer);
  }
}
