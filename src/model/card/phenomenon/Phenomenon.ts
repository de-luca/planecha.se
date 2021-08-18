import { MapStates } from '@/model/states';
import { Card } from '../Card';

export class Phenomenon extends Card {
  public get type(): string {
    return 'phenomenon';
  }

  public chaos(): void {
    return;
  }

  public enter(_states: MapStates): void {
    return;
  }

  public leave(): void {
    return;
  }
}
