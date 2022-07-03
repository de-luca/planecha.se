import { describe, it, expect } from 'vitest';
import { Container } from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { SingleDeck } from './SingleDeck';
import {
  MapType,
  EternitiesMapDeckType,
  EternitiesMapSubType,
} from '..';
import { WallStates } from '@/model/wall';

describe('EternitiesMap.type', () => {
  it('returns the type', () => {
    const map = new SingleDeck({
      deckType: EternitiesMapDeckType.PLANES,
      deck: Container.get(DeckProvider).getPlaneDeck(),
      walls: new WallStates(),
    });
    expect(map.specs.type).toEqual(MapType.ETERNITIES);
    expect(map.specs.subType).toEqual(EternitiesMapSubType.SINGLE_DECK);
    expect(map.specs.deckType).toEqual(EternitiesMapDeckType.PLANES);
  });
});

describe('EternitiesMap.initializeTiles', () => {
  it('initializes board tiles', () => {
    // it's called in the constructor...
    const map = new SingleDeck({
      deckType: EternitiesMapDeckType.PLANES,
      deck: Container.get(DeckProvider).getPlaneDeck(),
      walls: new WallStates(),
    });
    expect(map.tiles).toHaveLength(5);
  });
});

describe('EternitiesMap.planeswalk', () => {
  it('changes current active plane', () => {
    const map = new SingleDeck({
      deckType: EternitiesMapDeckType.PLANES,
      deck: Container.get(DeckProvider).getPlaneDeck(),
      walls: new WallStates(),
    });
    const currentActive = map.active;
    map.planeswalk({ x: 1, y: 0 });
    expect(map.active).not.toEqual(currentActive);
  });

  it('shifts the board right', () => {
    const map = new SingleDeck({
      deckType: EternitiesMapDeckType.PLANES,
      deck: Container.get(DeckProvider).getPlaneDeck(),
      walls: new WallStates(),
    });
    map.planeswalk({ x: 1, y: 0 });
    expect(map.tiles).toHaveLength(8);
    expect(map.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ coords: { x: -2, y: 0 } }),
        expect.objectContaining({ coords: { x: -1, y: -1 } }),
        expect.objectContaining({ coords: { x: -1, y: 1 } }),
      ]),
    );
  });

  it('shifts the board left', () => {
    const map = new SingleDeck({
      deckType: EternitiesMapDeckType.PLANES,
      deck: Container.get(DeckProvider).getPlaneDeck(),
      walls: new WallStates(),
    });
    map.planeswalk({ x: -1, y: 0 });
    expect(map.tiles).toHaveLength(8);
    expect(map.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ coords: { x: 2, y: 0 } }),
        expect.objectContaining({ coords: { x: 1, y: 1 } }),
        expect.objectContaining({ coords: { x: 1, y: -1 } }),
      ]),
    );
  });

  it('shifts the board up', () => {
    const map = new SingleDeck({
      deckType: EternitiesMapDeckType.PLANES,
      deck: Container.get(DeckProvider).getPlaneDeck(),
      walls: new WallStates(),
    });
    map.planeswalk({ x: 0, y: 1 });
    expect(map.tiles).toHaveLength(8);
    expect(map.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ coords: { x: 0, y: -2 } }),
        expect.objectContaining({ coords: { x: -1, y: -1 } }),
        expect.objectContaining({ coords: { x: 1, y: -1 } }),
      ]),
    );
  });

  it('shifts the board down', () => {
    const map = new SingleDeck({
      deckType: EternitiesMapDeckType.PLANES,
      deck: Container.get(DeckProvider).getPlaneDeck(),
      walls: new WallStates(),
    });
    map.planeswalk({ x: 0, y: -1 });
    expect(map.tiles).toHaveLength(8);
    expect(map.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ coords: { x: 0, y: 2 } }),
        expect.objectContaining({ coords: { x: -1, y: 1 } }),
        expect.objectContaining({ coords: { x: 1, y: 1 } }),
      ]),
    );
  });

  it('cleanup planes that are too far away', () => {
    const map = new SingleDeck({
      deckType: EternitiesMapDeckType.PLANES,
      deck: Container.get(DeckProvider).getPlaneDeck(),
      walls: new WallStates(),
    });

    map.planeswalk({ x: 0, y: -1 });
    expect(map.tiles).toHaveLength(8);
    expect(map.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ coords: { x: 0, y: 2 } }),
      ]),
    );

    map.planeswalk({ x: 0, y: -1 });
    expect(map.tiles).toHaveLength(11);
    expect(map.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ coords: { x: 0, y: 3 } }),
      ]),
    );

    map.planeswalk({ x: 0, y: -1 });
    expect(map.tiles).toHaveLength(11);
    expect(map.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ coords: { x: 0, y: 3 } }),
      ]),
    );
  });
});

describe('EternitiesMap.export', () => {
  it('exports the state of the map', () => {
    const map = new SingleDeck({
      deckType: EternitiesMapDeckType.PLANES,
      deck: Container.get(DeckProvider).getPlaneDeck(),
      walls: new WallStates(),
    });
    const exported = map.export();
    expect(exported.specs.type).toEqual(MapType.ETERNITIES);
    expect(exported.specs.subType).toEqual(EternitiesMapSubType.SINGLE_DECK);
    expect(exported.specs.deckType).toEqual(EternitiesMapDeckType.PLANES);
    expect(exported.deck.cards).toHaveLength(map.remaining);
    expect(exported.deck.played).toHaveLength(map.played.length);
    expect(exported.active).toHaveLength(map.active.length);
    const exportedIds = exported.active.map(exported => exported.id);
    for (const card of map.active) {
      expect(exportedIds).toContain(card.id);
    }
  });
});
