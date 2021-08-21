import _shuffle from 'lodash.shuffle';
import { Container } from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { Card, Plane } from '../card';
import { Deck } from '../deck/Deck';
import { MapStates, StateKey } from '../states';
import {
  Exported,
  MapSpecs,
  MapInterface,
  Revealed,
  Tile,
  EncounterTriggers,
} from './MapInterface';

export interface MapProps {
  states: MapStates;
  hasStarted: boolean;
  deck: Deck<Card>;
  active?: Array<Card>;
  revealed?: Revealed;
  destination?: Coordinates;
}

export abstract class Map implements MapInterface {
  protected deck: Deck<Card>;
  public readonly states: MapStates;
  public hasStarted: boolean;

  public active: Array<Card>;
  public revealed?: Revealed;

  public tiles: Array<Tile> = [];
  public destination?: Coordinates;
  public readonly encounterTriggers: EncounterTriggers;

  public constructor(props: MapProps) {
    this.deck = props.deck;
    this.states = props.states;
    this.hasStarted = props.hasStarted;
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

  public chaos(passivity?: Passivity): void {
    this.active.forEach(c => c.chaos(this.states, passivity));
  }

  public abstract planeswalk(
    coords?: Coordinates,
    passivity?: Passivity,
  ): boolean;
  public abstract customPlaneswalk(
    planes: Array<Plane>,
    coords?: Coordinates,
  ): void;

  public abstract resolve(passivity?: Passivity): boolean;

  public encounter(
    _coords: Coordinates,
    _passivity?: Passivity,
  ): boolean {
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
    this.states.delete(StateKey.REVEALER);
  }

  public clearRevealed(): void {
    this.revealed = undefined;
  }

  public export(): Exported {
    return {
      states: this.states.export(),
      hasStarted: this.hasStarted,
      specs: this.specs,
      deck: this.deck.export(),
      active: this.active.map(c => c.id),
      revealed: this.revealed === undefined
        ? undefined
        : {
          relevant: this.revealed.relevant.map(c => c.id),
          others: this.revealed.others.map(c => c.id),
        },
      destination: this.destination,
    };
  }

  public applyShuffle(state: Exported): void {
    this.deck = Container.get(DeckProvider).getDeckFromExport(state.deck);
    this.active = Container.get(DeckProvider).getOrderedPile(state.active);
    this.revealed = state.revealed === undefined
      ? undefined
      : {
        relevant: Container.get(DeckProvider).getOrderedPile(state.revealed.relevant),
        others: Container.get(DeckProvider).getOrderedPile(state.revealed.others),
      };
  }
}
