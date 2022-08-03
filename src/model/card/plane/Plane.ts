import { Card, Counter, Props } from '../Card';
import { ExportedCard } from '../CardInterface';
import type { WallStates } from '@/model/wall';

export class Plane extends Card {
  protected _counter?: Counter;

  public constructor(props: Props) {
    super(props);
    this._counter = props.counter ?? undefined;
  }

  public get counter(): Counter | undefined {
    return this._counter;
  }

  public get chaosRequireInterraction(): boolean {
    return false;
  }

  public initCounter(): void {
    if (this._counter) {
      this._counter.value = this._counter.start;
    }
  }

  public updateCounter(change: number): undefined | number {
    if (!this._counter) {
      return undefined;
    }

    this._counter.value = this._counter.value + change < 0
      ? 0
      : this._counter.value + change;

    return this._counter.value;
  }

  public chaos(_w: WallStates, _i: string): void {
    return;
  }

  public enter(_w: WallStates, _i: string): void {
    return;
  }

  public leave(): void {
    if (this._counter?.reset) {
      this._counter.value = this._counter.start;
    }
  }

  public export(): ExportedCard {
    return {
      id: this.id,
      counters: this._counter?.value,
    };
  }
}
