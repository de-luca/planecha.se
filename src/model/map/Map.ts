import _shuffle from 'lodash.shuffle';
import { patch } from '@n1ru4l/json-patch-plus';
import { Container } from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { Card, Plane } from '../card';
import { Deck } from '../deck/Deck';
import { WallStates, StateKey } from '../wall';
import { Tile } from './Tile';
import {
  Exported,
  MapSpecs,
  MapInterface,
  Revealed,
  EncounterTriggers,
  Patch,
} from './MapInterface';


export interface MapProps {
  walls: WallStates;
  hasStarted?: boolean;
  deck: Deck<Card>;
  active?: Array<Card>;
  revealed?: Revealed;
  destination?: Coordinates;
}

export abstract class Map implements MapInterface {
  protected deck: Deck<Card>;
  public walls: WallStates;
  public hasStarted: boolean;

  public active: Array<Card>;
  public revealed?: Revealed;

  public tiles: Array<Tile> = [];
  public destination?: Coordinates;
  public readonly encounterTriggers: EncounterTriggers;

  public constructor(props: MapProps) {
    this.deck = props.deck;
    this.walls = props.walls;
    this.hasStarted = props.hasStarted ?? false;
    this.active = props.active ?? [];
    this.revealed = props.revealed;
    this.destination = props.destination;
  }

  public abstract get specs(): MapSpecs;

  public get ready(): Promise<void> {
    return new Promise(resolve => resolve());
  }

  public get remaining(): number {
    return this.deck.remaining;
  }

  public get played(): Array<Card> {
    return this.deck.played;
  }

  public chaos(initiator?: string): void {
    this.active.forEach(c => c.chaos(this.walls, initiator));
  }

  public abstract planeswalk(coords?: Coordinates, initiator?: string): boolean;
  public abstract customPlaneswalk(planes: Array<Plane>, coords?: Coordinates): void;

  public abstract resolve(initiator?: string): boolean;

  public encounter(_coords: Coordinates, _initiator?: string): boolean {
    throw new Error(`Not compatible with ${this.constructor.name} class.`);
  }

  public updateCounter(planeId: string, change: number): void {
    (this.active.find(c => c.id === planeId) as Plane).updateCounter(change);
  }

  public revealUntil(count: number, type?: typeof Card): boolean {
    const { relevant, others, shuffled } = this.deck.revealUntil(count, type);
    this.revealed = { relevant, others };
    return shuffled;
  }

  public resolveReveal(top: Card[], bottom: Card[]): void {
    this.deck.putOnTop(top);
    this.deck.putOnTheBottom(bottom);

    this.clearRevealed();
    this.walls.delete(StateKey.REVEALER);
  }

  public clearRevealed(): void {
    this.revealed = undefined;
  }

  public export(): Exported {
    return {
      specs: this.specs,
      hasStarted: this.hasStarted,
      destination: this.destination,
      wallStates: this.walls.export(),
      deck: this.deck.export(),
      active: this.active.map(c => c.export()),
      revealed: this.revealed === undefined
        ? undefined
        : {
          relevant: this.revealed.relevant.map(c => c.id),
          others: this.revealed.others.map(c => c.id),
        },
    };
  }

  public apply(patch: Patch): void {
    const state = this.crunchState<Exported>(patch);
    if(state) {
      this.applyState(state);
    }
  }

  protected crunchState<T extends Exported>(p: Patch): Exported | undefined {
    return p.delta ? patch({ left: this.export(), delta: p.delta}) as T : undefined;
  }

  protected applyState(state: Exported): void {
    this.hasStarted = state.hasStarted;
    this.destination = state.destination;
    this.walls = new WallStates(state.wallStates);
    this.active.forEach(c => c.enter(this.walls));
    this.deck = Container.get(DeckProvider).getDeckFromExport(state.deck);
    this.active = Container.get(DeckProvider).getPileWithState(state.active);
    this.revealed = state.revealed === undefined
      ? undefined
      : {
        relevant: Container.get(DeckProvider).getOrderedPile(state.revealed.relevant),
        others: Container.get(DeckProvider).getOrderedPile(state.revealed.others),
      };
  }
}
