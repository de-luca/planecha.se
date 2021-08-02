import { Phenomenon } from "@/model/card";
import { Deck } from "@/model/deck/Deck";
import { SingleDeckProps, SingleDeck } from "./SingleDeck";
import {
  EternitiesMapDeckType,
  EternitiesMapSpecs,
  EternitiesMapSubType,
  MapInterface,
  MapType,
} from "../MapInterface";

export interface DualDeckProps extends SingleDeckProps {
  deckType: EternitiesMapDeckType.PLANES;
  phenomenaDeck: Deck<Phenomenon>;
  phenomenonTriggers: Map<PhenomenonTrigger, TriggerConfig>;
}

export enum PhenomenonTrigger {
  ON_PLANESWALK = 'ON_PLANESWALK',
  ON_HELLRIDE = 'ON_HELLRIDE',
}

export interface TriggerConfig {
  enabled: boolean;
  external: boolean;
  ratio: number;
}

export class DualDeck extends SingleDeck implements MapInterface {
  private phenomenaDeck: Deck<Phenomenon>;
  private phenomenonTriggers: Map<PhenomenonTrigger, TriggerConfig>;

  public constructor(props: DualDeckProps) {
    super(props);

    this.phenomenaDeck = props.phenomenaDeck;
  }

  public get specs(): EternitiesMapSpecs {
    return {
      type: MapType.ETERNITIES,
      subType: EternitiesMapSubType.DUAL_DECK,
      deckType: this.deckType,
    };
  }
}
