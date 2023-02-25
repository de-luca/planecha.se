import { describe, it, expect } from 'vitest';
import { MapFactory } from './MapFactory';
import { DualDeck, DualDeckExported, EncounterMechanic, EncounterTrigger, EternitiesMapDeckType, EternitiesMapSubType, SingleDeck, SingleDeckExported, TileStatus } from './eternities';
import { Classic, Exported, MapType } from '.';

describe('MapFactory.build', () => {
  it('creates a Classic Map', () => {
    const map = MapFactory.build({
      type: MapType.CLASSIC,
    });

    expect(map).toBeInstanceOf(Classic);
  });

  it('creates a SingleDeck Map', async () => {
    const map = MapFactory.build({
      type: MapType.ETERNITIES,
      specs: {
        subType: EternitiesMapSubType.SINGLE_DECK,
        deckType: EternitiesMapDeckType.PLANES,
      },
    });

    expect(map).toBeInstanceOf(SingleDeck);
  });

  it('creates a DualDeck Map', async () => {
    const map = MapFactory.build({
      type: MapType.ETERNITIES,
      specs: {
        subType: EternitiesMapSubType.DUAL_DECK,
        deckType: EternitiesMapDeckType.PLANES,
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
          { id: '15b979de-c8ee-4664-9ca7-6c4eb3346967' },
          { id: '38f84e55-049c-441e-b4e2-1e207ab5dbe5' },
          { id: '25650a32-4014-4065-ad01-7357c3ad3995' },
          { id: 'd6ab4159-e04e-4991-8a9b-9da302c98e9d' },
          { id: '805f9dc2-e172-481d-bae7-9a136a3d1e49' },
        ],
        played: [],
      },
      active: [{
        id: '82e67c57-6d7a-44cc-ba63-77ce887ab075',
      }],
      specs: {
        type: MapType.CLASSIC,
      },
    };

    const map = MapFactory.restore(exported);
    expect(map).toBeInstanceOf(Classic);
  });

  it('restores a SingleDeck', () => {
    const exported: SingleDeckExported = {
      wallStates: [],
      hasStarted: true,
      deck: {
        cards: [
          { id: '15b979de-c8ee-4664-9ca7-6c4eb3346967' },
          { id: '38f84e55-049c-441e-b4e2-1e207ab5dbe5' },
          { id: '25650a32-4014-4065-ad01-7357c3ad3995' },
          { id: 'd6ab4159-e04e-4991-8a9b-9da302c98e9d' },
          { id: '805f9dc2-e172-481d-bae7-9a136a3d1e49' },
        ],
        played: [],
      },
      active: [{
        id: '82e67c57-6d7a-44cc-ba63-77ce887ab075',
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
          id: '82e67c57-6d7a-44cc-ba63-77ce887ab075',
        }],
      }],
    };

    const map = MapFactory.restore(exported);
    expect(map).toBeInstanceOf(SingleDeck);
  });

  it('restores a DualDeck', () => {
    const exported: DualDeckExported = {
      wallStates: [],
      hasStarted: true,
      deck: {
        cards: [
          { id: '15b979de-c8ee-4664-9ca7-6c4eb3346967' },
          { id: '38f84e55-049c-441e-b4e2-1e207ab5dbe5' },
          { id: '25650a32-4014-4065-ad01-7357c3ad3995' },
          { id: 'd6ab4159-e04e-4991-8a9b-9da302c98e9d' },
          { id: '805f9dc2-e172-481d-bae7-9a136a3d1e49' },
        ],
        played: [],
      },
      active: [{
        id: '82e67c57-6d7a-44cc-ba63-77ce887ab075',
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
          id: '82e67c57-6d7a-44cc-ba63-77ce887ab075',
        }],
      }],
      phenomenaDeck: {
        cards: [
          { id: '6dc67a65-31bf-4535-9e02-8f6d6ecefde5' },
          { id: '7812174b-2dc1-43e8-b98f-639905e20ab7' },
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

    const map = MapFactory.restore(exported);
    expect(map).toBeInstanceOf(DualDeck);
  });
});
