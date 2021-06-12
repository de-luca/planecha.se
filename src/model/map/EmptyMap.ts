import { Log } from '@/store/states/map';
import { Card, Plane } from '../card';
import { Coordinates, Exported, MapInterface, MapType, Revealed } from './MapInterface';

export class EmptyMap implements MapInterface {
  public type: MapType;
  public active: Card[];
  public played: Card[];
  public revealed?: Revealed;
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
  customPlaneswalk(planes: Plane[], coordinates?: Coordinates): void {
    throw new Error('Method not implemented.');
  }
  updateCounter(id: string, change: number): void {
    throw new Error('Method not implemented.');
  }
  revealUntil(count: number, type?: typeof Card): void {
    throw new Error('Method not implemented.');
  }
  resolveReveal(top: Card[], bottom: Card[]): void {
    throw new Error('Method not implemented.');
  }
  putOnTop(cards: Card[]): void {
    throw new Error('Method not implemented.');
  }
  putOnTheBottom(cards: Card[]): void {
    throw new Error('Method not implemented.');
  }
  clearRevealed(): void {
    throw new Error('Method not implemented.');
  }
  export(): Exported {
    throw new Error('Method not implemented.');
  }
  getPlaneswalkLog(): Omit<Log, 'initiator'> {
    throw new Error('Method not implemented.');
  }
  getCounterLog(id: string, change: number): Omit<Log, 'initiator'> {
    throw new Error('Method not implemented.');
  }
}
