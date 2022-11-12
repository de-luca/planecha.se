import { Card } from '../card';
import { WallStates } from '../wall';
import {
  EncounterTriggers,
  EternitiesMapExported,
  EternitiesMapFactory,
  EternitiesMapSpecs,
} from './eternities';
import { Classic } from './Classic';
import { Exported, MapInterface, MapType } from './MapInterface';
import { CardProvider } from '@/services/CardProvider';

export interface AdvancedOptions {
  name?: string;
  cards?: Array<string>;
  specs?: Omit<EternitiesMapSpecs, 'type'>;
  encounterTriggers?: EncounterTriggers;
}

export interface BuildProps {
  type: MapType,
  online: boolean,
  advanced: AdvancedOptions,
}

export class MapFactory {
  public static build({ type, advanced }: BuildProps): MapInterface {
    switch (type) {
      case MapType.CLASSIC:
        return new Classic({
          wallStates: new WallStates(),
          deck: advanced.cards
            ? CardProvider.getCustomDeck(advanced.cards)
            : CardProvider.getDeck(),
        });
      case MapType.ETERNITIES:
        return EternitiesMapFactory.build(
          {
            type,
            ...advanced.specs as Omit<EternitiesMapSpecs, 'type'>,
          },
          advanced.encounterTriggers,
          advanced.cards,
        );
    }
  }

  public static restore(payload: Exported): MapInterface {
    switch (payload.specs.type) {
      case MapType.CLASSIC:
        return new Classic({
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
