import { eventBus, Event } from '@/services/EventBus';
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
    public enter(passive: boolean = false): void {
        eventBus.emit(Event.SPACIAL_MERGING, { passive });
    }
}
