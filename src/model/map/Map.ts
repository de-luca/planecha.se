import { Card, Plane } from '../card';
import { Deck } from '../deck/Deck';
import { WallStates, StateKey } from '../wall';
import {
  ChaosInput,
  Exported,
  MapSpecs,
  MapInterface,
  Revealed,
  PlaneswalkInput,
  ResolveInput,
  UpdateCounterInput,
  RevealUntilInput,
  ResolveRevealInput,
  AddActivePlaneInput,
} from './MapInterface';
import { CardProvider } from '#/services/CardProvider';
import { patch, Patch } from '#/utils/delta';


export interface MapProps {
  wallStates: WallStates;
  hasStarted?: boolean;
  deck: Deck<Card>;
  active?: Array<Card>;
  revealed?: Revealed;
}

export abstract class Map implements MapInterface {
  protected _deck: Deck<Card>;
  protected _hasStarted: boolean;
  protected _wallStates: WallStates;
  protected _revealed?: Revealed;
  protected _active: Array<Card>;

  public constructor(props: MapProps) {
    this._deck = props.deck;
    this._wallStates = props.wallStates;
    this._hasStarted = props.hasStarted ?? false;
    this._revealed = props.revealed;
    this._active = props.active ?? [];
  }

  public abstract get specs(): MapSpecs;

  public get ready(): Promise<void> {
    return new Promise(resolve => resolve());
  }

  public get hasStarted(): boolean {
    return this._hasStarted;
  }

  public get wallStates(): WallStates {
    return this._wallStates;
  }

  public get revealed(): Revealed | undefined {
    return this._revealed;
  }

  public get active(): Array<Card> {
    return this._active;
  }

  public get remaining(): number {
    return this._deck.remaining;
  }

  public get played(): Array<Card> {
    return this._deck.played;
  }

  public start(): void {
    this._hasStarted = true;
  }

  public chaos(input: ChaosInput): void {
    return input.card.chaos(this._wallStates, input.initiator);
  }

  public abstract planeswalk(input: PlaneswalkInput): void;

  public abstract addActivePlane(input: AddActivePlaneInput): void;

  public abstract resolve(input: ResolveInput): void;

  public updateCounter(input: UpdateCounterInput): void {
    (this._active.find(c => c.id === input.planeId) as Plane)
      .updateCounter(input.change);
  }

  public revealUntil(input: RevealUntilInput): void {
    const { relevant, others } = this._deck.revealUntil(
      input.count,
      input.type,
    );
    this._revealed = { relevant, others };
  }

  public resolveReveal(input: ResolveRevealInput): void {
    this._deck.putOnTop(input.top);
    this._deck.putOnTheBottom(input.bottom);
    this.clearRevealed();
    this._wallStates.delete(StateKey.REVEALER);
  }

  private clearRevealed(): void {
    this._revealed = undefined;
  }

  public dump(): Exported {
    return {
      specs: this.specs,
      hasStarted: this._hasStarted,
      wallStates: this._wallStates.export(),
      deck: this._deck.export(),
      active: this._active.map(c => c.export()),
      revealed: this._revealed === undefined
        ? undefined
        : {
          relevant: this._revealed.relevant.map(c => c.id),
          others: this._revealed.others.map(c => c.id),
        },
    };
  }

  public export(): Exported {
    return this.dump();
  }

  public apply(patch: Patch, _peer: string): void {
    const state = this.crunchState(patch);
    if (state) {
      this.restore(state);
    }
  }

  protected crunchState(p: Patch): Exported | undefined {
    return p.delta ? patch(this.export(), p.delta) : undefined;
  }

  public restore(state: Exported): void {
    this._hasStarted = state.hasStarted;
    this._wallStates = new WallStates(state.wallStates);
    this._deck = CardProvider.restoreDeck(state.deck);
    this._active = CardProvider.getCardList(state.active);
    this._revealed = state.revealed === undefined
      ? undefined
      : {
        relevant: CardProvider.getCardList(state.revealed.relevant),
        others: CardProvider.getCardList(state.revealed.others),
      };
  }
}
