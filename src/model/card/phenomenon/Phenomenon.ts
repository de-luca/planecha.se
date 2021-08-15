import { State } from '@/model/state/State';
import { Card } from '../Card';

export class Phenomenon extends Card {
  public get type(): string {
    return 'phenomenon';
  }

  public chaos(): void {
    return;
  }

  public enter(_state: State): void {
    return;
  }

  public leave(): void {
    return;
  }
}
