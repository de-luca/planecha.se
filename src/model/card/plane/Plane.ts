import { WallStates } from '@/model/wall';
import { Counter, Props } from '../CardFactory';
import { Card } from '../Card';
import { ExportedCard } from '../CardInterface';

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

    this.counter.value = this.counter.value + change < 0
      ? 0
      : this.counter.value + change;

    return this.counter.value;
  }

  public chaos(_w: WallStates, _i: string): void {
    return;
  }

  public enter(_w: WallStates, _i: string): void {
    return;
  }

  public leave(): void {
    if (this.counter?.reset) {
      this.counter.value = this.counter.start;
    }
  }

  public export(): ExportedCard {
    return {
      id: this.id,
      counters: this.counter?.value,
    };
  }
}
