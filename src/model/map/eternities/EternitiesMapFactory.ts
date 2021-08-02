import { Inject, Service } from "typedi";
import { DeckProvider } from '@/services/DeckProvider';
import { SingleDeck, SingleDeckProps } from "./SingleDeck";
import { DualDeck, DualDeckProps, PhenomenonTrigger, TriggerConfig } from "./DualDeck";
import {
  EternitiesMapDeckType,
  EternitiesMapSpecs,
  EternitiesMapSubType,
  Exported,
  MapInterface,
} from "../MapInterface";
import { Card, Plane } from "@/model/card";
import { Deck } from "@/model/deck/Deck";

@Service()
export class EternitiesMapFactory {
  @Inject(() => DeckProvider)
  private deckProvider: DeckProvider;

  public build(
    specs: EternitiesMapSpecs,
    phenomenonTriggers?: Record<PhenomenonTrigger, TriggerConfig>,
    cards?: Array<string>,
  ): MapInterface {
    const deck = this.getDeck(specs, cards);

    if (specs.subType === EternitiesMapSubType.SINGLE_DECK) {
      return new SingleDeck({ deck, deckType: specs.deckType });
    }

    const triggers = new Map<PhenomenonTrigger, TriggerConfig>();
    if (phenomenonTriggers?.ON_HELLRIDE) {
      triggers.set(PhenomenonTrigger.ON_HELLRIDE, phenomenonTriggers.ON_HELLRIDE);
    }
    if (phenomenonTriggers?.ON_PLANESWALK) {
      triggers.set(PhenomenonTrigger.ON_PLANESWALK, phenomenonTriggers.ON_PLANESWALK);
    }

    return new DualDeck({
      deck,
      deckType: EternitiesMapDeckType.PLANES,
      phenomenaDeck: this.deckProvider.getPhenomenonDeck(),
      phenomenonTriggers: triggers,
    });
  }

  private getDeck(specs: EternitiesMapSpecs, cards?: Array<string>): Deck<Card> {
    switch (true) {
      case cards !== undefined:
        return this.deckProvider.getSpecificDeck(cards as Array<string>);
      case specs.deckType === EternitiesMapDeckType.ALL:
        return this.deckProvider.getDeck();
      default:
        return this.deckProvider.getPlaneDeck();
    }
  }

  public restore(payload: Exported): MapInterface {
    const specs = payload.specs as EternitiesMapSpecs;
    const props: SingleDeckProps = {
      deckType: specs.deckType,
      deck: this.deckProvider.getDeckFromExport<Plane>(payload.deck),
      active: this.deckProvider.getOrderedPile<Plane>(payload.active),
      revealed: payload.revealed
        ? {
          relevant: this.deckProvider.getOrderedPile<Card>(payload.revealed.relevant),
          others: this.deckProvider.getOrderedPile<Card>(payload.revealed.others),
        }
        : undefined,
      tiles: payload.tiles?.map(t => ({
        coordinates: t.coordinates,
        state: t.state,
        plane: this.deckProvider.getOrderedPile(t.plane),
      })),
      hasStarted: payload.hasStarted,
    };

    // if (specs.subType === EternitiesMapSubType.SINGLE_DECK) {
      return new SingleDeck(props);
    // }

    // return new DualDeck({
    //   ...props,
    //   phenomenaDeck: this.deckProvider.getPhenomenonDeck(),
    // });
  }
}
