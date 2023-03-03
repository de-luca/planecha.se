import { MapInterface } from '../MapInterface';
import { SingleDeck, SingleDeckExported, SingleDeckProps } from './SingleDeck';
import { DualDeck, DualDeckExported, EncounterTriggers } from './DualDeck';
import { Tile } from './Tile';
import { EternitiesMapDeckType, EternitiesMapExported, EternitiesMapSpecs, EternitiesMapSubType } from './EternitiesMap';
import { CardProvider } from '#/services/CardProvider';
import { Card, Plane } from '#/model/card';
import { Deck } from '#/model/deck/Deck';
import { WallStates } from '#/model/wall';

export class EternitiesMapFactory {
  public static build(
    specs: EternitiesMapSpecs,
    encounterTriggers?: EncounterTriggers,
    cards?: Array<string>,
  ): MapInterface {
    const deck = this.getDeck(specs, cards);
    const state = new WallStates();

    if (specs.subType === EternitiesMapSubType.SINGLE_DECK) {
      return new SingleDeck({
        deck,
        wallStates: state,
        deckType: specs.deckType,
      });
    }

    return new DualDeck({
      deck,
      wallStates: state,
      deckType: EternitiesMapDeckType.PLANES,
      phenomenaDeck: CardProvider.getPhenomenonDeck(),
      encounterTriggers: encounterTriggers as EncounterTriggers,
    });
  }

  private static getDeck(specs: EternitiesMapSpecs, cards?: Array<string>): Deck<Card> {
    switch (true) {
      case cards !== undefined:
        return CardProvider.getCustomDeck(cards as Array<string>);
      case specs.subType === EternitiesMapSubType.DUAL_DECK:
        return CardProvider.getPlaneDeck();
      case specs.deckType === EternitiesMapDeckType.ALL:
        return CardProvider.getDeck();
      default:
        return CardProvider.getPlaneDeck();
    }
  }

  public static restore(payload: EternitiesMapExported): MapInterface {
    const specs = payload.specs as EternitiesMapSpecs;
    const props: SingleDeckProps = {
      wallStates: new WallStates(payload.wallStates),
      hasStarted: payload.hasStarted,
      deckType: specs.deckType,
      deck: CardProvider.restoreDeck<Plane>(payload.deck),
      active: CardProvider.getCardList<Plane>(payload.active),
      revealed: payload.revealed
        ? {
          relevant: CardProvider.getCardList<Card>(payload.revealed.relevant),
          others: CardProvider.getCardList<Card>(payload.revealed.others),
        }
        : undefined,
      tiles: payload.tiles?.map(Tile.fromExport),
    };

    if (specs.subType === EternitiesMapSubType.SINGLE_DECK) {
      return new SingleDeck({
        ...props,
        destination: (payload as SingleDeckExported).destination,
      });
    }

    return new DualDeck({
      ...props,
      deckType: EternitiesMapDeckType.PLANES,
      phenomenaDeck: CardProvider.restoreDeck((payload as DualDeckExported).phenomenaDeck),
      encounterTriggers: (payload as DualDeckExported).encounterTriggers,
    });
  }
}
