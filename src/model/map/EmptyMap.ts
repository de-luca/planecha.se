import { Card } from '../card';
import { WallStates } from '../wall';
import {
  Exported,
  MapSpecs,
  MapInterface,
  Revealed,
  Patch,
} from './MapInterface';

export class EmptyMap implements MapInterface {
  specs: MapSpecs;
  ready: Promise<void>;
  hasStarted: boolean;
  wallStates: WallStates;
  revealed?: Revealed | undefined;
  active: Card[];
  remaining: number;
  played: Card[];
  start(): void {
    throw new Error('Method not implemented.');
  }
  revealUntil(): void {
    throw new Error('Method not implemented.');
  }
  resolveReveal(): void {
    throw new Error('Method not implemented.');
  }
  chaos(): void {
    throw new Error('Method not implemented.');
  }
  planeswalk(): void {
    throw new Error('Method not implemented.');
  }
  resolve(): void {
    throw new Error('Method not implemented.');
  }
  updateCounter(): void {
    throw new Error('Method not implemented.');
  }
  export(): Exported {
    throw new Error('Method not implemented.');
  }
  apply(patch: Patch): void {
    throw new Error('Method not implemented.');
  }
}
