import { Counter } from '../../Card';
import { Plane } from '../Plane';
import { eventBus, EventType } from '#/services/EventBus';

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
  declare protected _counter: Counter;

  public chaos(): void {
    this.updateCounter(1);
  }

  public updateCounter(change: number): undefined | number {
    super.updateCounter(change);
    this.checkMaxCounters();

    return this._counter?.value;
  }

  private checkMaxCounters(): void {
    if (this._counter.value >= (this._counter.max as number)) {
      eventBus.emit(EventType.ARETOPOLIS);
    }
  }
}
