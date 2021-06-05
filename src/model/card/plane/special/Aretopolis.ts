import { eventBus } from '@/services/EventBus';
import { Counter } from '../../CardFactory';
import { Plane } from '../Plane';
import { CardEvent } from '../../CardEvent';

export class Aretopolis extends Plane {
    declare public counter: Counter;

    public incCounter(): undefined | number {
        super.incCounter();
        this.checkMaxCounters();

        return this.counter?.value;
    }

    public decCounter(): undefined | number {
        super.decCounter();
        this.checkMaxCounters()

        return this.counter?.value;
    }

    private checkMaxCounters(): void {
        if (this.counter.value >= (this.counter.max as number)) {
            eventBus.emit(CardEvent.ARETOPOLIS);
        }
    }
}
