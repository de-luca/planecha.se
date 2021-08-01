import { Inject, Service } from "typedi";
import { DeckProvider } from '@/services/DeckProvider';
import { EternitiesProps, SingleDeck } from "./SingleDeck";
import { DualDeck, DualDeckInterface } from "./DualDeck";
import {
  EternitiesMapDeckType,
  EternitiesMapSpecs,
  EternitiesMapSubType,
  EternitiesMapVariant,
  Exported,
  MapInterface,
} from "../MapInterface";
import { Card, Plane } from "@/model/card";
import { BaseVariant, OnHellride, OnPlaneswalk } from "./variant";
import { Deck } from "@/model/deck/Deck";

type VariantConstructor = { new(map: DualDeckInterface): BaseVariant };

@Service()
export class EternitiesMapFactory {
  private static readonly VariantMap: Record<EternitiesMapVariant, VariantConstructor> = {
    [EternitiesMapVariant.ON_PLANESWALK]: OnPlaneswalk,
    [EternitiesMapVariant.ON_HELLRIDE]: OnHellride,
  }

  @Inject(() => DeckProvider)
  private deckProvider: DeckProvider;

  public build(
    specs: EternitiesMapSpecs,
    cards?: Array<string>,
  ): MapInterface {
    const deck = this.getDeck(specs, cards);

    if (specs.subType === EternitiesMapSubType.SINGLE_DECK) {
      return new SingleDeck({ deck, deckType: specs.deckType });
    }

    let map: MapInterface = new DualDeck({
      deck,
      deckType: specs.deckType,
      phenomenaDeck: this.deckProvider.getPhenomenonDeck(),
    });

    for (const variant of specs.variants) {
      map = new EternitiesMapFactory.VariantMap[variant](map);
    }

    return map;
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
    const props: EternitiesProps = {
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

    if (specs.subType === EternitiesMapSubType.SINGLE_DECK) {
      return new SingleDeck(props);
    }

    let map: MapInterface = new DualDeck({
      ...props,
      phenomenaDeck: this.deckProvider.getPhenomenonDeck(),
    });

    for (const variant of specs.variants) {
      map = new EternitiesMapFactory.VariantMap[variant](map);
    }

    return map;
  }
}
