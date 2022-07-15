import { Phenomenon } from '@/model/card';
import { Deck, DeckState } from '@/model/deck/Deck';
import { SingleDeckProps, SingleDeck } from './SingleDeck';
import {
  Initable,
  MapType,
  ResolveInput,
} from '../MapInterface';
import { EternitiesMapDeckType, EternitiesMapExported, EternitiesMapSpecs, EternitiesMapSubType } from './EternitiesMap';
import { StateKey } from '@/model/wall';
import { DeckProvider } from '@/services/DeckProvider';
import { Container } from 'typedi';

export enum EncounterTrigger {
  ON_PLANESWALK = 'ON_PLANESWALK',
  ON_HELLRIDE = 'ON_HELLRIDE',
}

export enum EncounterMechanic {
  MANUAL = 'MANUAL',
  AUTO = 'AUTO',
}

interface TriggerConfigEnabled {
  enabled: true;
  mechanic: EncounterMechanic;
  ratio: number;
}
interface TriggerConfigDisabled {
  enabled: false;
}

export type TriggerConfig = TriggerConfigEnabled | TriggerConfigDisabled;
export type EncounterTriggers = Record<EncounterTrigger, TriggerConfig>;

export interface DualDeckExported extends EternitiesMapExported {
  phenomenaDeck: DeckState;
  encounterTriggers: EncounterTriggers;
}

export interface DualDeckProps extends SingleDeckProps {
  deckType: EternitiesMapDeckType.PLANES;
  phenomenaDeck: Deck<Phenomenon>;
  encounterTriggers: EncounterTriggers;
}

export interface EncounterInput extends Initable {
  coords: Coordinates;
}

export class DualDeck extends SingleDeck {
  private _phenomenaDeck: Deck<Phenomenon>;
  private _encounterTriggers: EncounterTriggers;

  public constructor(props: DualDeckProps) {
    super(props);
    this._phenomenaDeck = props.phenomenaDeck;
    this._encounterTriggers = props.encounterTriggers;
  }

  public get specs(): EternitiesMapSpecs {
    return {
      type: MapType.ETERNITIES,
      subType: EternitiesMapSubType.DUAL_DECK,
      deckType: this._deckType,
    };
  }

  public get encounterTriggers(): EncounterTriggers {
    return this._encounterTriggers;
  }

  public get remainingPhenomena(): number {
    return this._phenomenaDeck.remaining;
  }

  public get playedPhenomena(): Array<Phenomenon> {
    return this._phenomenaDeck.played;
  }

  public encounter(input: EncounterInput): void {
    this._destination = input.coords;
    this._active = [this._phenomenaDeck.draw()];
    this._active.forEach(c => c.enter(this._wallStates, input.initiator));
    this._wallStates.set(StateKey.PHENOMENON_WALL, { initiator: input.initiator });
  }

  public override resolve(input: ResolveInput): void {
    this._phenomenaDeck.setPlayed(...this._active as Array<Phenomenon>);
    this._wallStates.delete(StateKey.PHENOMENON_WALL);
    this.planeswalk({
      ...input,
      coords: this._destination as Coordinates,
    });
  }

  public override export(): DualDeckExported {
    return {
      ...super.export(),
      phenomenaDeck: this._phenomenaDeck.export(),
      encounterTriggers: this._encounterTriggers,
    };
  }

  protected override applyState(state: DualDeckExported): void {
    super.applyState(state);
    this._phenomenaDeck = Container.get(DeckProvider).getDeckFromExport(state.phenomenaDeck);
  }
}
