import _shuffle from 'lodash.shuffle';
import { Container } from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { eventBus, EventType } from '@/services/EventBus';
import { Card, Plane } from '../card';
import { Deck } from '../deck/Deck';
import {
  Coordinates,
  Exported,
  MapSpecs,
  MapInterface,
  Revealed,
  Tile,
  EncounterTriggers,
} from './MapInterface';

export interface MapProps {
  deck: Deck<Card>;
  active?: Array<Card>;
  revealed?: Revealed;
}

export abstract class Map implements MapInterface {
  protected deck: Deck<Card>;

  public active: Array<Card>;
  public revealed?: Revealed;

  public tiles: Array<Tile> = [];
  public hasStarted: boolean;
  public destination?: Coordinates | undefined;
  public readonly encounterTriggers: EncounterTriggers;

  public constructor(props: MapProps) {
    this.deck = props.deck;
    this.active = props.active ?? [];
    this.revealed = props.revealed;
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
    this.active.forEach(c => c.chaos(passivity));
  }

  public abstract planeswalk(
    coordinates?: Coordinates,
    passivity?: Passivity,
  ): boolean;
  public abstract customPlaneswalk(
    planes: Array<Plane>,
    coordinates?: Coordinates,
  ): void;

  public abstract planeswalkFromPhenomenon(passivity?: Passivity): boolean;

  public encounter(
    _coordinates: Coordinates,
    _passivity?: Passivity,
  ): boolean {
    throw new Error(`Not compatible with ${this.constructor.name} class.`);
  }

  public updateCounter(id: string, change: number): void {
    (this.active.find(c => c.id === id) as Plane).updateCounter(change);
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
    eventBus.emit(EventType.RESOLVED_REVEAL);
  }

  public clearRevealed(): void {
    this.revealed = undefined;
  }

  public export(): Exported {
    return {
      specs: this.specs,
      deck: this.deck.export(),
      active: this.active.map(c => c.id),
      revealed: this.revealed === undefined
        ? undefined
        : {
          relevant: this.revealed.relevant.map(c => c.id),
          others: this.revealed.others.map(c => c.id),
        },
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
