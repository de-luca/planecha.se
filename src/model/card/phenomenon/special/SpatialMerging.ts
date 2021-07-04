import { eventBus, EventType } from '@/services/EventBus';
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
  public enter(passive: boolean = false, mateId?: string): void {
    eventBus.emit(EventType.SPACIAL_MERGING, { passive, mateId });
  }
}
