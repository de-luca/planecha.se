import { Phenomenon } from '@/model/card';
import { Deck, DeckState } from '@/model/deck/Deck';
import { SingleDeckProps, SingleDeck } from './SingleDeck';
import {
  EncounterTriggers,
  EternitiesMapDeckType,
  EternitiesMapSpecs,
  EternitiesMapSubType,
  Initable,
  MapType,
  ResolveInput,
} from '../MapInterface';
import { EternitiesMapExported } from './EternitiesMap';
import { StateKey } from '@/model/wall';
import { DeckProvider } from '@/services/DeckProvider';
import { Container } from 'typedi';

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
  private phenomenaDeck: Deck<Phenomenon>;
  public readonly encounterTriggers: EncounterTriggers;

  public constructor(props: DualDeckProps) {
    super(props);

    this.phenomenaDeck = props.phenomenaDeck;
    this.encounterTriggers = props.encounterTriggers;
  }

  public get specs(): EternitiesMapSpecs {
    return {
      type: MapType.ETERNITIES,
      subType: EternitiesMapSubType.DUAL_DECK,
      deckType: this.deckType,
    };
  }

  public get remainingPhenomena(): number {
    return this.phenomenaDeck.remaining;
  }

  public get playedPhenomena(): Array<Phenomenon> {
    return this.phenomenaDeck.played;
  }

  public encounter(input: EncounterInput): void {
    this.destination = input.coords;
    this.active = [this.phenomenaDeck.draw().card];
    this.active.forEach(c => c.enter(this.walls, input.initiator));
    this.walls.set(StateKey.PHENOMENON_WALL, { initiator: input.initiator });
  }

  public override resolve(input: ResolveInput): void {
    this.phenomenaDeck.setPlayed(...this.active as Array<Phenomenon>);
    this.walls.delete(StateKey.PHENOMENON_WALL);
    this.planeswalk({
      ...input,
      coords: this.destination as Coordinates,
    });
  }

  public override export(): DualDeckExported {
    return {
      ...super.export(),
      phenomenaDeck: this.phenomenaDeck.export(),
      encounterTriggers: this.encounterTriggers,
    };
  }

  protected override applyState(state: DualDeckExported): void {
    super.applyState(state);
    this.phenomenaDeck = Container.get(DeckProvider).getDeckFromExport(state.phenomenaDeck);
  }
}
