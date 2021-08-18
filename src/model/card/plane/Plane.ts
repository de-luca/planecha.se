import { MapStates } from '@/model/states';
import { Counter, Props } from '../CardFactory';
import { Card } from '../Card';

export class Plane extends Card {
  public counter?: Counter;

  public constructor(props: Props) {
    super(props);

    this.counter = props.counter ?? undefined;
  }

  public get type(): string {
    return 'plane';
  }

  public initCounter(): void {
    if (this.counter) {
      this.counter.value = this.counter.start;
    }
  }

  public updateCounter(change: number): undefined | number {
    if (!this.counter) {
      return undefined;
    }

    this.counter.value = this.counter.value + change;

    return this.counter.value;
  }

  public chaos(_states: MapStates): void {
    return;
  }

  public enter(_states: MapStates): void {
    return;
  }

  public leave(): void {
    if (this.counter?.reset) {
      this.counter.value = this.counter.start;
    }
  }
}
