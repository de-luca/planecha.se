import { eventBus } from '@/services/EventBus';
import { Counter } from '../../CardFactory';
import { Plane } from '../Plane';
import { CardEvent } from '../../CardEvent';

export class Aretopolis extends Plane {
    declare public counter: Counter;

    public chaos(): void {
        this.updateCounter(1);
    }

    public updateCounter(change: number): undefined | number {
        super.updateCounter(change);
        this.checkMaxCounters();

        return this.counter?.value;
    }

    private checkMaxCounters(): void {
        if (this.counter.value >= (this.counter.max as number)) {
            eventBus.emit(CardEvent.ARETOPOLIS);
        }
    }
}
