import { describe, it, expect } from 'vitest';
import { Container } from 'typedi';
import { Phenomenon, Plane } from '@/model/card';
import { MapType } from '../MapInterface';
import { EternitiesMapDeckType, EternitiesMapSubType } from './EternitiesMap';
import { EternitiesMapFactory } from './EternitiesMapFactory';
import { SingleDeck, SingleDeckExported } from './SingleDeck';
import { DualDeck, DualDeckExported, EncounterMechanic, EncounterTrigger } from './DualDeck';
import { TileStatus } from './Tile';

describe('EternitiesMapFactory.build', () => {
  it('creates a SingleDeck without Phenomena', () => {
    const factory = Container.get(EternitiesMapFactory);
    const map = factory.build({
      type: MapType.ETERNITIES,
      subType: EternitiesMapSubType.SINGLE_DECK,
      deckType: EternitiesMapDeckType.PLANES,
    });

    expect(map).toBeInstanceOf(SingleDeck);
    (map as SingleDeck)['_deck']['_cards'].forEach(c => {
      expect(c).toBeInstanceOf(Plane);
    });
  });

  it('creates a SingleDeck with Phenomena', () => {
    const factory = Container.get(EternitiesMapFactory);
    const map = factory.build({
      type: MapType.ETERNITIES,
      subType: EternitiesMapSubType.SINGLE_DECK,
      deckType: EternitiesMapDeckType.ALL,
    });

    expect(map).toBeInstanceOf(SingleDeck);
  });

  it('creates a DualDeck', async () => {
    const factory = Container.get(EternitiesMapFactory);
    const map = factory.build({
      type: MapType.ETERNITIES,
      subType: EternitiesMapSubType.DUAL_DECK,
      deckType: EternitiesMapDeckType.PLANES,
    });

    expect(map).toBeInstanceOf(DualDeck);
    (map as DualDeck)['_deck']['_cards'].forEach(c => {
      expect(c).toBeInstanceOf(Plane);
    });
    (map as DualDeck)['_phenomenaDeck']['_cards'].forEach(c => {
      expect(c).toBeInstanceOf(Phenomenon);
    });
  });
});

describe('EternitiesMapFactory.restore', () => {
  it('restores a SingleDeck', () => {
    const exported: SingleDeckExported = {
      wallStates: [],
      hasStarted: true,
      deck: {
        cards: [
          'ed4f4210-9871-4cec-9b46-100c80f93cd4',
          '6caf8b21-1807-442c-a461-c89c7591df70',
          'a1c7f2eb-0654-46f9-ae3d-11efcac837b8',
          'd6dc655e-d8ef-443a-bb3e-46c7ca1555ba',
          '56c735c0-9346-431b-869f-3accfa193016',
        ],
        played: [],
      },
      active: [{
        id: '434a2d09-5776-4168-b863-f3b0a736d19b',
      }],
      specs: {
        type: MapType.ETERNITIES,
        subType: EternitiesMapSubType.SINGLE_DECK,
        deckType: EternitiesMapDeckType.PLANES,
      },
      tiles: [{
        coords: { x: 0, y: 0 },
        state: TileStatus.ACTIVE,
        plane: [{
          id: '434a2d09-5776-4168-b863-f3b0a736d19b',
        }],
      }],
    };

    const factory = Container.get(EternitiesMapFactory);
    const map = factory.restore(exported);
    expect(map).toBeInstanceOf(SingleDeck);
  });

  it('restores a DualDeck', () => {
    const exported: DualDeckExported = {
      wallStates: [],
      hasStarted: true,
      deck: {
        cards: [
          'ed4f4210-9871-4cec-9b46-100c80f93cd4',
          '6caf8b21-1807-442c-a461-c89c7591df70',
          'a1c7f2eb-0654-46f9-ae3d-11efcac837b8',
          'd6dc655e-d8ef-443a-bb3e-46c7ca1555ba',
          '56c735c0-9346-431b-869f-3accfa193016',
        ],
        played: [],
      },
      active: [{
        id: '434a2d09-5776-4168-b863-f3b0a736d19b',
      }],
      specs: {
        type: MapType.ETERNITIES,
        subType: EternitiesMapSubType.DUAL_DECK,
        deckType: EternitiesMapDeckType.ALL,
      },
      tiles: [{
        coords: { x: 0, y: 0 },
        state: TileStatus.ACTIVE,
        plane: [{
          id: '434a2d09-5776-4168-b863-f3b0a736d19b',
        }],
      }],
      phenomenaDeck: {
        cards: [
          '42ecb371-53aa-4368-8ddd-88ae8e90ae0c',
          '56e4874c-9d3d-4a1c-a027-186a33ce0da7',
        ],
        played: [],
      },
      encounterTriggers: {
        [EncounterTrigger.ON_HELLRIDE]: {
          enabled: true,
          mechanic: EncounterMechanic.AUTO,
          ratio: 1,
        },
        [EncounterTrigger.ON_PLANESWALK]: {
          enabled: true,
          mechanic: EncounterMechanic.AUTO,
          ratio: 1 / 6,
        },
      },
    };

    const factory = Container.get(EternitiesMapFactory);
    const map = factory.restore(exported);
    expect(map).toBeInstanceOf(DualDeck);
  });
});
