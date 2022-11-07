import { Inject, Service } from 'typedi';
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

@Service()
export class MapFactory {
  @Inject(() => CardProvider)
  private cardProvider: CardProvider;
  @Inject(() => EternitiesMapFactory)
  private eternitiesMapFactory: EternitiesMapFactory;

  public build({ type, advanced }: BuildProps): MapInterface {
    switch (type) {
      case MapType.CLASSIC:
        return new Classic({
          wallStates: new WallStates(),
          deck: advanced.cards
            ? this.cardProvider.getCustomDeck(advanced.cards)
            : this.cardProvider.getDeck(),
        });
      case MapType.ETERNITIES:
        return this.eternitiesMapFactory.build(
          {
            type,
            ...advanced.specs as Omit<EternitiesMapSpecs, 'type'>,
          },
          advanced.encounterTriggers,
          advanced.cards,
        );
    }
  }

  public restore(payload: Exported): MapInterface {
    switch (payload.specs.type) {
      case MapType.CLASSIC:
        return new Classic({
          deck: this.cardProvider.restoreDeck<Card>(payload.deck),
          wallStates: new WallStates(payload.wallStates),
          hasStarted: payload.hasStarted,
          active: this.cardProvider.getCardList<Card>(payload.active),
          revealed: payload.revealed
            ? {
              relevant: this.cardProvider.getCardList<Card>(payload.revealed.relevant),
              others: this.cardProvider.getCardList<Card>(payload.revealed.others),
            }
            : undefined,
        });
      case MapType.ETERNITIES:
        return this.eternitiesMapFactory.restore(payload as EternitiesMapExported);
      default:
        throw new Error('Incompatible');
    }
  }
}
