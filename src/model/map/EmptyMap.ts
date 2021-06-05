import { Log } from '@/store/states/map';
import { Card } from '../card';
import { Coordinates, Exported, MapInterface, MapType } from './MapInterface';

export class EmptyMap implements MapInterface {
  public type: MapType;
  public active: Card[];
  public played: Card[];
  public ready: Promise<void>;
  getDeckSize(): number {
    throw new Error('Method not implemented.');
  }
  chaos(): void {
    throw new Error('Method not implemented.');
  }
  planeswalk(coordinates?: Coordinates): void {
    throw new Error('Method not implemented.');
  }
  export(): Exported {
    throw new Error('Method not implemented.');
  }
  getLog(): Omit<Log, 'initiator'> {
    throw new Error('Method not implemented.');
  }
}
