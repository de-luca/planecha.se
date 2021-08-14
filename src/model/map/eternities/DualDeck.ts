import { Phenomenon } from "@/model/card";
import { Deck, DeckState } from "@/model/deck/Deck";
import { SingleDeckProps, SingleDeck } from "./SingleDeck";
import {
  Coordinates,
  EternitiesMapDeckType,
  EternitiesMapSpecs,
  EternitiesMapSubType,
  MapType,
} from "../MapInterface";
import { EternitiesMapExported } from "./EternitiesMap";

export interface DualDeckExported extends EternitiesMapExported {
  phenomenaDeck: DeckState;
  encounterTriggers: EncounterTriggers;
}

export interface DualDeckProps extends SingleDeckProps {
  deckType: EternitiesMapDeckType.PLANES;
  phenomenaDeck: Deck<Phenomenon>;
  encounterTriggers: EncounterTriggers;
}

export enum EncounterTrigger {
  ON_PLANESWALK = 'ON_PLANESWALK',
  ON_HELLRIDE = 'ON_HELLRIDE',
}

export enum EncounterMechanic {
  MANUAL = 'MANUAL',
  AUTO = 'AUTO',
}

export interface TriggerConfig {
  enabled: boolean;
  mechanic: EncounterMechanic;
  ratio: number;
}

export type EncounterTriggers = Record<EncounterTrigger, TriggerConfig>;

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

  public planeswalkFromPhenomenon(passive: boolean = false, mateId?: string): boolean {
    this.phenomenaDeck.setPlayed(...this.active);
    const shuffled = this.planeswalk(
      this.destination as Coordinates,
      passive,
      mateId,
    );
    return shuffled;
  }

  public override encounter(
    coordinates: Coordinates,
    passive: boolean = false,
    mateId?: string,
  ): boolean {
    this.destination = coordinates;
    const { card: drawn, shuffled } = this.phenomenaDeck.draw();
    this.active = [ drawn ];
    this.active.forEach(c => c.enter(passive, mateId));
    return shuffled;
  }

  public export(): DualDeckExported {
    return {
      ...super.export(),
      phenomenaDeck: this.phenomenaDeck.export(),
      encounterTriggers: this.encounterTriggers,
    };
  }
}
