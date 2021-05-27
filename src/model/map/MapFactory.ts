import { DeckProvider } from "@/services/DeckProvider";
import { Inject, Service } from "typedi";
import { Card, Plane } from "../card";
import { OnlineDecorator } from "./OnlineDecorator";
import { Classic } from "./Classic";
import { EmptyMap } from "./EmptyMap";
import { EternitiesMap } from "./EternitiesMap";
import { Exported, MapInterface, MapType } from "./MapInterface";

export interface AdvancedOptions {}

export interface BuildProps {
  type: MapType,
  online: boolean,
  advanced?: AdvancedOptions,
}

@Service()
export class MapFactory {
  @Inject(() => DeckProvider)
  private deckProvider: DeckProvider;

  public build({ type, online, advanced }: BuildProps): MapInterface {
    let map: MapInterface;
    
    switch (type) {
      case MapType.EMPTY:
        map = new EmptyMap();
        break;
      case MapType.CLASSIC:
        map = new Classic({
          deck: this.deckProvider.getDeck(),
        });
        break;
      case MapType.ETERNITIES:
        map = new EternitiesMap({
          deck: this.deckProvider.getPlaneDeck(),
        });
    }

    if (online) {
      return new OnlineDecorator(map);
    }

    return map;
  }

  public restore(payload: Exported): MapInterface {
    let map: MapInterface;

    switch (payload.type) {
      case MapType.CLASSIC:
        map = new Classic({
          deck: this.deckProvider.getSpecificDeck<Card>(payload.deck),
          active: this.deckProvider.getSpecificDeck<Card>(payload.active),
          played: this.deckProvider.getSpecificDeck<Card>(payload.played),
        });
        break;
      case MapType.ETERNITIES:
        map = new EternitiesMap({
          deck: this.deckProvider.getSpecificDeck<Plane>(payload.deck),
          active: this.deckProvider.getSpecificDeck<Plane>(payload.active),
          played: this.deckProvider.getSpecificDeck<Plane>(payload.played),
        });
        break;
      default:
        throw new Error("Incompatible");
    }

    return map;
  }
}