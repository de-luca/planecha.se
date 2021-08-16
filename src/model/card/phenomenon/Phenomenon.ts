import { MapState } from '@/model/state/MapState';
import { Card } from '../Card';

export class Phenomenon extends Card {
  public get type(): string {
    return 'phenomenon';
  }

  public chaos(): void {
    return;
  }

  public enter(_state: MapState): void {
    return;
  }

  public leave(): void {
    return;
  }
}
