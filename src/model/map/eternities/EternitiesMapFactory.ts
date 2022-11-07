import { Inject, Service } from 'typedi';
import { MapInterface } from '../MapInterface';
import { SingleDeck, SingleDeckExported, SingleDeckProps } from './SingleDeck';
import { DualDeck, DualDeckExported, EncounterTriggers } from './DualDeck';
import { Tile } from './Tile';
import { EternitiesMapDeckType, EternitiesMapExported, EternitiesMapSpecs, EternitiesMapSubType } from './EternitiesMap';
import { CardProvider } from '@/services/CardProvider';
import { Card, Plane } from '@/model/card';
import { Deck } from '@/model/deck/Deck';
import { WallStates } from '@/model/wall';

@Service()
export class EternitiesMapFactory {
  @Inject(() => CardProvider)
  private cardProvider: CardProvider;

  public build(
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
      phenomenaDeck: this.cardProvider.getPhenomenonDeck(),
      encounterTriggers: encounterTriggers as EncounterTriggers,
    });
  }

  private getDeck(specs: EternitiesMapSpecs, cards?: Array<string>): Deck<Card> {
    switch (true) {
      case cards !== undefined:
        return this.cardProvider.getCustomDeck(cards as Array<string>);
      case specs.subType === EternitiesMapSubType.DUAL_DECK:
        return this.cardProvider.getPlaneDeck();
      case specs.deckType === EternitiesMapDeckType.ALL:
        return this.cardProvider.getDeck();
      default:
        return this.cardProvider.getPlaneDeck();
    }
  }

  public restore(payload: EternitiesMapExported): MapInterface {
    const specs = payload.specs as EternitiesMapSpecs;
    const props: SingleDeckProps = {
      wallStates: new WallStates(payload.wallStates),
      hasStarted: payload.hasStarted,
      deckType: specs.deckType,
      deck: this.cardProvider.restoreDeck<Plane>(payload.deck),
      active: this.cardProvider.getCardList<Plane>(payload.active),
      revealed: payload.revealed
        ? {
          relevant: this.cardProvider.getCardList<Card>(payload.revealed.relevant),
          others: this.cardProvider.getCardList<Card>(payload.revealed.others),
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
      phenomenaDeck:
        this.cardProvider.restoreDeck((payload as DualDeckExported).phenomenaDeck),
      encounterTriggers: (payload as DualDeckExported).encounterTriggers,
    });
  }
}
