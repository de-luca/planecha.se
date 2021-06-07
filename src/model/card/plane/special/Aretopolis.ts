import { eventBus } from '@/services/EventBus';
import { Counter } from '../../CardFactory';
import { Plane } from '../Plane';
import { CardEvent } from '../../CardEvent';

/**
 * When you planeswalk to Aretopolis or at the beginning of your upkeep, 
 * put a scroll counter on Aretopolis, then you gain life equal to the 
 * number of scroll counters on it.
 * 
 * When Aretopolis has ten or more scroll counters on it, planeswalk.
 * 
 * Whenever you roll {CHAOS}, put a scroll counter on Aretopolis, 
 * then draw cards equal to the number of scroll counters on it.
 */
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
