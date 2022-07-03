import { Inject, Service } from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { Card } from '../card';
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
import { WallStates } from '../wall';

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

  public build({ type, advanced }: BuildProps): MapInterface {
    switch (type) {
      case MapType.EMPTY:
        return new EmptyMap();
      case MapType.CLASSIC:
        return new Classic({
          walls: new WallStates(),
          deck: advanced.cards
            ? this.deckProvider.getSpecificDeck(advanced.cards)
            : this.deckProvider.getDeck(),
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
          deck: this.deckProvider.getDeckFromExport<Card>(payload.deck),
          walls: new WallStates(payload.wallStates),
          hasStarted: payload.hasStarted,
          active: this.deckProvider.getPileWithState<Card>(payload.active),
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
