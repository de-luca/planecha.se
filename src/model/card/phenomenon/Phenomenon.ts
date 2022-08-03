import { Card } from '../Card';
import { WallStates } from '@/model/wall';

export class Phenomenon extends Card {
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
