import { Inject, Service } from "typedi";
import { DeckProvider } from "@/services/DeckProvider";
import { Card, Plane } from "../card";
import { OnlineDecorator } from "./OnlineDecorator";
import { Classic, EmptyMap, EternitiesMap } from ".";
import { Exported, MapInterface, MapType } from "./MapInterface";

export interface AdvancedOptions {
  name?: string;
  cards?: Set<string>;
}

export interface BuildProps {
  type: MapType,
  online: boolean,
  advanced: AdvancedOptions,
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
          deck: advanced.cards 
            ? this.deckProvider.getSpecificDeck(advanced.cards)
            : this.deckProvider.getDeck(),
        });
        break;
      case MapType.ETERNITIES:
        map = new EternitiesMap({
          deck: this.deckProvider.getPlaneDeck(),
        });
    }

    if (online) {
      return new OnlineDecorator(map, advanced.name as string);
    }

    return map;
  }

  public restore(payload: Exported): MapInterface {
    let map: MapInterface;

    switch (payload.type) {
      case MapType.CLASSIC:
        map = new Classic({
          deck: this.deckProvider.getOrderedDeck<Card>(payload.deck),
          active: this.deckProvider.getOrderedDeck<Card>(payload.active),
          played: this.deckProvider.getOrderedDeck<Card>(payload.played),
        });
        break;
      case MapType.ETERNITIES:
        map = new EternitiesMap({
          deck: this.deckProvider.getOrderedDeck<Plane>(payload.deck),
          active: this.deckProvider.getOrderedDeck<Plane>(payload.active),
          played: this.deckProvider.getOrderedDeck<Plane>(payload.played),
        });
        break;
      default:
        throw new Error("Incompatible");
    }

    return map;
  }
}