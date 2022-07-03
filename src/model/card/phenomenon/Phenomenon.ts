import { WallStates } from '@/model/wall';
import { Card } from '../Card';

export class Phenomenon extends Card {
  public get type(): string {
    return 'phenomenon';
  }

  public chaos(): void {
    return;
  }

  public enter(_w: WallStates, _i: string): void {
    return;
  }

  public leave(): void {
    return;
  }
}
