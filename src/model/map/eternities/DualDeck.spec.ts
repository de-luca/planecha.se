import { Container } from 'typedi';
import { describe, expect, it, vi } from 'vitest';
import { MapType } from '../MapInterface';
import { DualDeck, EncounterMechanic } from './DualDeck';
import { EternitiesMapDeckType, EternitiesMapSubType } from './EternitiesMap';
import { DeckProvider } from '@/services/DeckProvider';
import { StateKey, WallStates } from '@/model/wall';
import { Phenomenon, Plane } from '@/model/card';

describe('DualDeck.specs', () => {
  it('returns a tile from an exported payload', () => {
    const map = new DualDeck({
      deck: Container.get(DeckProvider).getPlaneDeck(),
      phenomenaDeck: Container.get(DeckProvider).getPhenomenonDeck(),
      deckType: EternitiesMapDeckType.PLANES,
      wallStates: new WallStates(),
      encounterTriggers: {
        ON_HELLRIDE: {
          enabled: true,
          mechanic: EncounterMechanic.AUTO,
          ratio: 1,
        },
        ON_PLANESWALK: {
          enabled: false,
        },
      },
    });
    expect(map.specs.type).toEqual(MapType.ETERNITIES);
    expect(map.specs.subType).toEqual(EternitiesMapSubType.DUAL_DECK);
    expect(map.encounterTriggers.ON_HELLRIDE).toEqual({
      enabled: true,
      mechanic: EncounterMechanic.AUTO,
      ratio: 1,
    });
    expect(map.encounterTriggers.ON_PLANESWALK).toEqual({
      enabled: false,
    });
  });
});

describe('DualDeck.encounter', () => {
  it('returns a tile from an exported payload', () => {
    const map = new DualDeck({
      deck: Container.get(DeckProvider).getPlaneDeck(),
      phenomenaDeck: Container.get(DeckProvider).getPhenomenonDeck(),
      deckType: EternitiesMapDeckType.PLANES,
      wallStates: new WallStates(),
      encounterTriggers: {
        ON_HELLRIDE: {
          enabled: true,
          mechanic: EncounterMechanic.AUTO,
          ratio: 1,
        },
        ON_PLANESWALK: {
          enabled: false,
        },
      },
    });

    const phenomenaDeckSize = map.remainingPhenomena;

    map.encounter({ coords: { x: 1, y: 1 }, initiator: 'foo' });
    expect(map.destination).toEqual({ x: 1, y: 1 });
    expect(map.remainingPhenomena).toEqual(phenomenaDeckSize - 1);
    expect(map.active).toHaveLength(1);
    expect(map.active[0]).toBeInstanceOf(Phenomenon);
    expect(map.wallStates.has(StateKey.PHENOMENON_WALL)).toEqual(true);
  });
});

describe('DualDeck.resolve', () => {
  it('resolves the current encounter and planeswalk', () => {
    const map = new DualDeck({
      deck: Container.get(DeckProvider).getPlaneDeck(),
      phenomenaDeck: Container.get(DeckProvider).getPhenomenonDeck(),
      deckType: EternitiesMapDeckType.PLANES,
      wallStates: new WallStates(),
      encounterTriggers: {
        ON_HELLRIDE: {
          enabled: true,
          mechanic: EncounterMechanic.AUTO,
          ratio: 1,
        },
        ON_PLANESWALK: {
          enabled: false,
        },
      },
    });

    map.encounter({ coords: { x: 1, y: 1 }, initiator: 'foo' });
    const planeswalkSpy = vi.spyOn(map, 'planeswalk');
    const remaining = map.remaining;
    const playedPhenomena = map.playedPhenomena.length;

    map.resolve({ initiator: 'foo' });
    expect(map.active).toHaveLength(1);
    expect(map.active[0]).toBeInstanceOf(Plane);
    // planeswalking from 0:0 to 1:1 uses 1 for 1:1 et 2 for each empty sides
    expect(map.remaining).toEqual(remaining - 3);
    expect(map.playedPhenomena.length).toEqual(playedPhenomena + 1);
    expect(planeswalkSpy).toHaveBeenCalled();
  });
});

describe('DualDeck.export', () => {
  it('exports the state of the map', () => {
    const map = new DualDeck({
      deck: Container.get(DeckProvider).getPlaneDeck(),
      phenomenaDeck: Container.get(DeckProvider).getPhenomenonDeck(),
      deckType: EternitiesMapDeckType.PLANES,
      wallStates: new WallStates(),
      encounterTriggers: {
        ON_HELLRIDE: {
          enabled: true,
          mechanic: EncounterMechanic.AUTO,
          ratio: 1,
        },
        ON_PLANESWALK: {
          enabled: false,
        },
      },
    });
    const exported = map.export();
    expect(exported.specs.type).toEqual(MapType.ETERNITIES);
    expect(exported.specs.subType).toEqual(EternitiesMapSubType.DUAL_DECK);
    expect(exported.specs.deckType).toEqual(EternitiesMapDeckType.PLANES);
    expect(exported.deck.cards).toHaveLength(map.remaining);
    expect(exported.deck.played).toHaveLength(map.played.length);
    expect(exported.phenomenaDeck.cards).toHaveLength(map.remainingPhenomena);
    expect(exported.phenomenaDeck.played).toHaveLength(map.playedPhenomena.length);
    expect(exported.active).toHaveLength(map.active.length);
    expect(exported.encounterTriggers).toEqual({
      ON_HELLRIDE: {
        enabled: true,
        mechanic: EncounterMechanic.AUTO,
        ratio: 1,
      },
      ON_PLANESWALK: {
        enabled: false,
      },
    });
    const exportedIds = exported.active.map(exported => exported.id);
    for (const card of map.active) {
      expect(exportedIds).toContain(card.id);
    }
  });
});
