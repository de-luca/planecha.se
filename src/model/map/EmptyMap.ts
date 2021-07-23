import { Card } from '../card';
import { Exported, MapInterface, MapType, Revealed, Tile } from './MapInterface';

export class EmptyMap implements MapInterface {
  public type: MapType;
  public active: Card[];
  public played: Card[];
  public revealed?: Revealed;
  public ready: Promise<void>;
  public tiles: Tile[];
  public hasStarted: boolean;
  getDeckSize(): number {
    throw new Error('Method not implemented.');
  }
  chaos(): boolean {
    throw new Error('Method not implemented.');
  }
  planeswalk(): boolean {
    throw new Error('Method not implemented.');
  }
  customPlaneswalk(): void {
    throw new Error('Method not implemented.');
  }
  planeswalkFromPhenomenon(): boolean {
    throw new Error('Method not implemented.');
  }
  updateCounter(): void {
    throw new Error('Method not implemented.');
  }
  revealUntil(): boolean {
    throw new Error('Method not implemented.');
  }
  resolveReveal(): void {
    throw new Error('Method not implemented.');
  }
  putOnTop(): void {
    throw new Error('Method not implemented.');
  }
  putOnTheBottom(): void {
    throw new Error('Method not implemented.');
  }
  clearRevealed(): void {
    throw new Error('Method not implemented.');
  }
  export(): Exported {
    throw new Error('Method not implemented.');
  }
  applyShuffle(): void {
    throw new Error('Method not implemented.');
  }
}
