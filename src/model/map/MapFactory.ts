import { Inject, Service } from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { Card } from '../card';
import { OnlineDecorator } from '../net/OnlineDecorator';
import {
  Classic,
  EmptyMap,
  EncounterTriggers,
  EternitiesMapSpecs,
  Exported,
  MapInterface,
  MapType,
} from '.';
import { EternitiesMapExported, EternitiesMapFactory } from './eternities';
import { MapStates } from '../states';

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
          states: new MapStates(),
          hasStarted: true,
        });
        break;
      case MapType.ETERNITIES:
        map = this.eternitiesMapFactory.build(
          {
            type,
            ...advanced.specs as Omit<EternitiesMapSpecs, 'type'>,
          },
          advanced.encounterTriggers,
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
    payload.states.forEach(kv => kv[1].passive = true);

    switch (payload.specs.type) {
      case MapType.CLASSIC:
        return new Classic({
          deck: this.deckProvider.getDeckFromExport<Card>(payload.deck),
          states: new MapStates(payload.states),
          hasStarted: payload.hasStarted,
          active: this.deckProvider.getOrderedPile<Card>(payload.active),
          revealed: payload.revealed
            ? {
              relevant: this.deckProvider.getOrderedPile<Card>(payload.revealed.relevant),
              others: this.deckProvider.getOrderedPile<Card>(payload.revealed.others),
            }
            : undefined,
          destination: payload.destination,
        });
      case MapType.ETERNITIES:
        return this.eternitiesMapFactory.restore(payload as EternitiesMapExported);
      default:
        throw new Error('Incompatible');
    }
  }
}
