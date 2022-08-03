import { describe, it, expect } from 'vitest';
import { Container } from 'typedi';
import { MapFactory } from './MapFactory';
import { DualDeck, DualDeckExported, EncounterMechanic, EncounterTrigger, EternitiesMapDeckType, EternitiesMapSubType, SingleDeck, SingleDeckExported, TileStatus } from './eternities';
import { Classic, Exported, MapType } from '.';

describe('MapFactory.build', () => {
  it('creates a Classic Map', () => {
    const factory = Container.get(MapFactory);
    const map = factory.build({
      type: MapType.CLASSIC,
      online: false,
      advanced: {},
    });

    expect(map).toBeInstanceOf(Classic);
  });

  it('creates a SingleDeck Map', async () => {
    const factory = Container.get(MapFactory);
    const map = factory.build({
      type: MapType.ETERNITIES,
      online: false,
      advanced: {
        specs: {
          subType: EternitiesMapSubType.SINGLE_DECK,
          deckType: EternitiesMapDeckType.PLANES,
        },
      },
    });

    expect(map).toBeInstanceOf(SingleDeck);
  });

  it('creates a DualDeck Map', async () => {
    const factory = Container.get(MapFactory);
    const map = factory.build({
      type: MapType.ETERNITIES,
      online: false,
      advanced: {
        specs: {
          subType: EternitiesMapSubType.DUAL_DECK,
          deckType: EternitiesMapDeckType.PLANES,
        },
      },
    });

    expect(map).toBeInstanceOf(DualDeck);
  });
});

describe('MapFactory.restore', () => {
  it('restores a Classic Map', () => {
    const exported: Exported = {
      wallStates: [],
      hasStarted: true,
      deck: {
        cards: [
          { id: 'ed4f4210-9871-4cec-9b46-100c80f93cd4' },
          { id: '6caf8b21-1807-442c-a461-c89c7591df70' },
          { id: 'a1c7f2eb-0654-46f9-ae3d-11efcac837b8' },
          { id: 'd6dc655e-d8ef-443a-bb3e-46c7ca1555ba' },
          { id: '56c735c0-9346-431b-869f-3accfa193016' },
        ],
        played: [],
      },
      active: [{
        id: '434a2d09-5776-4168-b863-f3b0a736d19b',
      }],
      specs: {
        type: MapType.CLASSIC,
      },
    };

    const factory = Container.get(MapFactory);
    const map = factory.restore(exported);
    expect(map).toBeInstanceOf(Classic);
  });

  it('restores a SingleDeck', () => {
    const exported: SingleDeckExported = {
      wallStates: [],
      hasStarted: true,
      deck: {
        cards: [
          { id: 'ed4f4210-9871-4cec-9b46-100c80f93cd4' },
          { id: '6caf8b21-1807-442c-a461-c89c7591df70' },
          { id: 'a1c7f2eb-0654-46f9-ae3d-11efcac837b8' },
          { id: 'd6dc655e-d8ef-443a-bb3e-46c7ca1555ba' },
          { id: '56c735c0-9346-431b-869f-3accfa193016' },
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

    const factory = Container.get(MapFactory);
    const map = factory.restore(exported);
    expect(map).toBeInstanceOf(SingleDeck);
  });

  it('restores a DualDeck', () => {
    const exported: DualDeckExported = {
      wallStates: [],
      hasStarted: true,
      deck: {
        cards: [
          { id: 'ed4f4210-9871-4cec-9b46-100c80f93cd4' },
          { id: '6caf8b21-1807-442c-a461-c89c7591df70' },
          { id: 'a1c7f2eb-0654-46f9-ae3d-11efcac837b8' },
          { id: 'd6dc655e-d8ef-443a-bb3e-46c7ca1555ba' },
          { id: '56c735c0-9346-431b-869f-3accfa193016' },
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
          { id: '42ecb371-53aa-4368-8ddd-88ae8e90ae0c' },
          { id: '56e4874c-9d3d-4a1c-a027-186a33ce0da7' },
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

    const factory = Container.get(MapFactory);
    const map = factory.restore(exported);
    expect(map).toBeInstanceOf(DualDeck);
  });
});
