import type { Counter, Props } from '../CardFactory';
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

  public incCounter(): undefined | number {
    if (!this.counter) {
      return undefined;
    }

    return ++this.counter.value;
  }

  public decCounter(): undefined | number {
    if (!this.counter) {
      return undefined;
    }

    return this.counter.value === 0
      ? this.counter.value
      : --this.counter.value;
  }

  public chaos(): void {
    return;
  }

  public enter(): void {
    return;
  }

  public leave(): void {
    if (this.counter?.reset) {
      this.counter.value = this.counter.start;
    }
  }
}
