import { WallStates } from '@/model/wall';
import { Counter, Props } from '../CardFactory';
import { Card } from '../Card';
import { ExportedCard } from '../CardInterface';

export class Plane extends Card {
  protected _counter?: Counter;

  public constructor(props: Props) {
    super(props);
    this._counter = props.counter ?? undefined;
  }

  public get counter(): Counter | undefined {
    return this._counter;
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
