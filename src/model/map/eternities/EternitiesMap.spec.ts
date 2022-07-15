import { describe, it, expect } from 'vitest';
import { Container } from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { MapType } from '..';
import { WallStates } from '@/model/wall';
import {
  EternitiesMap,
  EternitiesMapDeckType,
  EternitiesMapSpecs,
  EternitiesMapSubType,
} from './EternitiesMap';

class TestMap extends EternitiesMap {

  public get specs(): EternitiesMapSpecs {
    return {
      deckType: EternitiesMapDeckType.ALL,
      subType: EternitiesMapSubType.SINGLE_DECK,
      type: MapType.ETERNITIES,
    };
  }
  public planeswalk(): void {
    throw new Error('Method not implemented.');
  }
  public resolve(): void {
    throw new Error('Method not implemented.');
  }
}

describe('EternitiesMap.initializeTiles', () => {
  it('initializes board tiles', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
      wallStates: new WallStates(),
      deckType: EternitiesMapDeckType.ALL,
    });
    expect(map.tiles).toHaveLength(5);
  });
});