import { eventBus } from '@/services/EventBus';
import { CardEvent } from '../..';
import { Plane } from '../Plane';

export class StairsToInfinity extends Plane {
    public chaos(): void {
        console.log('ICI');
        eventBus.emit(CardEvent.STAIRS_TO_INFINITY);
    }
}
