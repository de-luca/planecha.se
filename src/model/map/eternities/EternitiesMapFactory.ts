import { Inject, Service } from "typedi";
import { DeckProvider } from '@/services/DeckProvider';
import { SingleDeck, SingleDeckProps } from "./SingleDeck";
import { DualDeck, DualDeckExported } from "./DualDeck";
import {
  EncounterTriggers,
  EternitiesMapDeckType,
  EternitiesMapSpecs,
  EternitiesMapSubType,
  MapInterface,
} from "../MapInterface";
import { Card, Plane } from "@/model/card";
import { Deck } from "@/model/deck/Deck";
import { EternitiesMapExported } from "./EternitiesMap";
import { MapStates } from "@/model/states";

@Service()
export class EternitiesMapFactory {
  @Inject(() => DeckProvider)
  private deckProvider: DeckProvider;

  public build(
    specs: EternitiesMapSpecs,
    encounterTriggers?: EncounterTriggers,
    cards?: Array<string>,
  ): MapInterface {
    const deck = this.getDeck(specs, cards);
    const state = new MapStates();

    if (specs.subType === EternitiesMapSubType.SINGLE_DECK) {
      return new SingleDeck({
        deck,
        states: state,
        hasStarted: false,
        deckType: specs.deckType,
      });
    }

    return new DualDeck({
      deck,
      states: state,
      hasStarted: false,
      deckType: EternitiesMapDeckType.PLANES,
      phenomenaDeck: this.deckProvider.getPhenomenonDeck(),
      encounterTriggers: encounterTriggers as EncounterTriggers,
    });
  }

  private getDeck(specs: EternitiesMapSpecs, cards?: Array<string>): Deck<Card> {
    switch (true) {
      case cards !== undefined:
        return this.deckProvider.getSpecificDeck(cards as Array<string>);
      case specs.subType === EternitiesMapSubType.DUAL_DECK:
        return this.deckProvider.getPlaneDeck();
      case specs.deckType === EternitiesMapDeckType.ALL:
        return this.deckProvider.getDeck();
      default:
        return this.deckProvider.getPlaneDeck();
    }
  }

  public restore(payload: EternitiesMapExported): MapInterface {
    const specs = payload.specs as EternitiesMapSpecs;
    const props: SingleDeckProps = {
      states: new MapStates(payload.states),
      hasStarted: payload.hasStarted,
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
      destination: payload.destination,
    };

    if (specs.subType === EternitiesMapSubType.SINGLE_DECK) {
      return new SingleDeck(props);
    }

    return new DualDeck({
      ...props,
      deckType: EternitiesMapDeckType.PLANES,
      phenomenaDeck:
        this.deckProvider.getDeckFromExport((payload as DualDeckExported).phenomenaDeck),
      encounterTriggers: (payload as DualDeckExported).encounterTriggers,
    });
  }
}
