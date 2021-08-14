import { Card } from '../card';
import {
  Exported,
  MapSpecs,
  MapInterface,
  Revealed,
  Tile,
} from './MapInterface';

export class EmptyMap implements MapInterface {
  public specs: MapSpecs;
  public played: Card[];
  public remaining: number;
  public active: Card[];
  public revealed?: Revealed;
  public ready: Promise<void>;
  public tiles: Tile[];
  public hasStarted: boolean;
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
  encounter(): boolean {
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
