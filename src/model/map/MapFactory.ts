import { Card } from '../card';
import { WallStates } from '../wall';
import {
  EncounterTriggers,
  EternitiesMapExported,
  EternitiesMapFactory,
  EternitiesMapSpecs,
} from './eternities';
import { Single } from './single/Single';
import { Exported, MapInterface, MapType } from './MapInterface';
import { CardProvider } from '#/services/CardProvider';

export interface BuildProps {
  type: MapType,
  cards?: Array<string>;
  specs?: Omit<EternitiesMapSpecs, 'type'>;
  encounterTriggers?: EncounterTriggers;
}

export class MapFactory {
  public static build(props: BuildProps): MapInterface {
    switch (props.type) {
      case MapType.SINGLE:
        return new Single({
          wallStates: new WallStates(),
          deck: props.cards
            ? CardProvider.getCustomDeck(props.cards)
            : CardProvider.getDeck(),
        });
      case MapType.ETERNITIES:
        return EternitiesMapFactory.build(
          {
            type: props.type,
            ...props.specs as Omit<EternitiesMapSpecs, 'type'>,
          },
          props.encounterTriggers,
          props.cards,
        );
      default:
        throw new Error('Incompatible');
    }
  }

  public static restore(payload: Exported): MapInterface {
    switch (payload.specs.type) {
      case MapType.SINGLE:
        return new Single({
          deck: CardProvider.restoreDeck<Card>(payload.deck),
          wallStates: new WallStates(payload.wallStates),
          hasStarted: payload.hasStarted,
          active: CardProvider.getCardList<Card>(payload.active),
          revealed: payload.revealed
            ? {
              relevant: CardProvider.getCardList<Card>(payload.revealed.relevant),
              others: CardProvider.getCardList<Card>(payload.revealed.others),
            }
            : undefined,
        });
      case MapType.ETERNITIES:
        return EternitiesMapFactory.restore(payload as EternitiesMapExported);
      default:
        throw new Error('Incompatible');
    }
  }
}
