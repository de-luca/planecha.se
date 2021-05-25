import { Card } from '../card';
import { Coordinates, MapInterface, MapType } from './MapInterface';

export class EmptyMap implements MapInterface {
  public type: MapType;
  public active: Card[];
  public played: Card[];
  public ready: Promise<void>;
  getDeckSize(): number {
    throw new Error('Method not implemented.');
  }
  planeswalk(coordinates?: Coordinates): void {
    throw new Error('Method not implemented.');
  }
}
