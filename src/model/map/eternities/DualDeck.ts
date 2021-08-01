import { Phenomenon } from "@/model/card";
import { Deck } from "@/model/deck/Deck";
import { EternitiesProps, SingleDeck } from "./SingleDeck";
import {
  EternitiesMapDeckType,
  EternitiesMapSpecs,
  EternitiesMapSubType,
  MapInterface,
  MapType,
} from "../MapInterface";

export interface DualDeckInterface extends MapInterface {}

interface Props extends EternitiesProps {
  phenomenaDeck: Deck<Phenomenon>;
}

export class DualDeck extends SingleDeck implements DualDeckInterface {
  public phenomenaDeck: Deck<Phenomenon>;

  public constructor(props: Props) {
    super(props);

    this.phenomenaDeck = props.phenomenaDeck;
    this.deckType = EternitiesMapDeckType.PLANES;
  }

  public get specs(): EternitiesMapSpecs {
    return {
      type: MapType.ETERNITIES,
      subType: EternitiesMapSubType.DUAL_DECK,
      deckType: this.deckType,
      variants: [],
    };
  }
}
