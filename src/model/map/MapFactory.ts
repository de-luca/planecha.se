import { Inject, Service } from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { Card } from '../card';
import { OnlineDecorator } from '../net/OnlineDecorator';
import {
  Classic,
  EmptyMap,
  EternitiesMapFactory,
  EternitiesMapSpecs,
  Exported,
  MapInterface,
  MapType,
} from '.';
import { PhenomenonTrigger, TriggerConfig } from './eternities';


export interface AdvancedOptions {
  name?: string;
  cards?: Array<string>;
  specs?: Omit<EternitiesMapSpecs, 'type'>;
  phenomenonTriggers?: Record<PhenomenonTrigger, TriggerConfig>;
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
  @Inject(() => EternitiesMapFactory)
  private eternitiesMapFactory: EternitiesMapFactory;

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
        map = this.eternitiesMapFactory.build(
          {
            type,
            ...advanced.specs as Omit<EternitiesMapSpecs, 'type'>,
          },
          advanced.phenomenonTriggers,
          advanced.cards,
        );
        break;
    }

    if (online) {
      return new OnlineDecorator(map, advanced.name as string);
    }

    return map;
  }

  public restore(payload: Exported): MapInterface {
    switch (payload.specs.type) {
      case MapType.CLASSIC:
        return new Classic({
          deck: this.deckProvider.getDeckFromExport<Card>(payload.deck),
          active: this.deckProvider.getOrderedPile<Card>(payload.active),
          revealed: payload.revealed
            ? {
              relevant: this.deckProvider.getOrderedPile<Card>(payload.revealed.relevant),
              others: this.deckProvider.getOrderedPile<Card>(payload.revealed.others),
            }
            : undefined,
        });
      case MapType.ETERNITIES:
        return this.eternitiesMapFactory.restore(payload);
      default:
        throw new Error('Incompatible');
    }
  }
}
