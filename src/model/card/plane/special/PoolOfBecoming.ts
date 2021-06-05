import { eventBus } from '@/services/EventBus';
import { CardEvent } from '../..';
import { Plane } from '../Plane';

export class PoolOfBecoming extends Plane {
    public chaos(): void {
        eventBus.emit(CardEvent.POOL_OF_BECOMING);
    }
}
