import { Container } from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { EternitiesMap } from '.';
import { MapType } from './MapInterface';

describe('EternitiesMap.type', () => {
  it('returns the type', () => {
    const map = new EternitiesMap({
      deck: Container.get(DeckProvider).getPlaneDeck(),
    });
    expect(map.type).toEqual(MapType.ETERNITIES);
  });
});

describe('EternitiesMap.initializeTiles', () => {
  it('initializes board tiles', () => {
    // it's called in the constructor...
    const map = new EternitiesMap({
      deck: Container.get(DeckProvider).getPlaneDeck(),
    });
    expect(map.tiles).toHaveLength(5);
  });
});

describe('EternitiesMap.planeswalk', () => {
  it('changes current active plane', () => {
    const map = new EternitiesMap({
      deck: Container.get(DeckProvider).getPlaneDeck(),
    });
    const currentActive = map.active;
    map.planeswalk({ x: 1, y: 0 });
    expect(map.active).not.toEqual(currentActive);
  });

  it('shifts the board right', () => {
    const map = new EternitiesMap({
      deck: Container.get(DeckProvider).getPlaneDeck(),
    });
    map.planeswalk({ x: 1, y: 0 });
    expect(map.tiles).toHaveLength(8);
    expect(map.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ coordinates: { x: -2, y: 0 } }),
        expect.objectContaining({ coordinates: { x: -1, y: -1 } }),
        expect.objectContaining({ coordinates: { x: -1, y: 1 } }),
      ]),
    );
  });

  it('shifts the board left', () => {
    const map = new EternitiesMap({
      deck: Container.get(DeckProvider).getPlaneDeck(),
    });
    map.planeswalk({ x: -1, y: 0 });
    expect(map.tiles).toHaveLength(8);
    expect(map.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ coordinates: { x: 2, y: 0 } }),
        expect.objectContaining({ coordinates: { x: 1, y: 1 } }),
        expect.objectContaining({ coordinates: { x: 1, y: -1 } }),
      ]),
    );
  });

  it('shifts the board up', () => {
    const map = new EternitiesMap({
      deck: Container.get(DeckProvider).getPlaneDeck(),
    });
    map.planeswalk({ x: 0, y: 1 });
    expect(map.tiles).toHaveLength(8);
    expect(map.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ coordinates: { x: 0, y: -2 } }),
        expect.objectContaining({ coordinates: { x: -1, y: -1 } }),
        expect.objectContaining({ coordinates: { x: 1, y: -1 } }),
      ]),
    );
  });

  it('shifts the board down', () => {
    const map = new EternitiesMap({
      deck: Container.get(DeckProvider).getPlaneDeck(),
    });
    map.planeswalk({ x: 0, y: -1 });
    expect(map.tiles).toHaveLength(8);
    expect(map.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ coordinates: { x: 0, y: 2 } }),
        expect.objectContaining({ coordinates: { x: -1, y: 1 } }),
        expect.objectContaining({ coordinates: { x: 1, y: 1 } }),
      ]),
    );
  });

  it('cleanup planes that are too far away', () => {
    const map = new EternitiesMap({
      deck: Container.get(DeckProvider).getPlaneDeck(),
    });

    map.planeswalk({ x: 0, y: -1 });
    expect(map.tiles).toHaveLength(8);
    expect(map.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ coordinates: { x: 0, y: 2 } }),
      ]),
    );

    map.planeswalk({ x: 0, y: -1 });
    expect(map.tiles).toHaveLength(11);
    expect(map.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ coordinates: { x: 0, y: 3 } }),
      ]),
    );

    map.planeswalk({ x: 0, y: -1 });
    expect(map.tiles).toHaveLength(11);
    expect(map.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ coordinates: { x: 0, y: 3 } }),
      ]),
    );
  });
});

describe('EternitiesMap.export', () => {
  it('exports the state of the map', () => {
    const map = new EternitiesMap({
      deck: Container.get(DeckProvider).getPlaneDeck(),
    });
    const exported = map.export();
    expect(exported.type).toEqual(MapType.ETERNITIES);
    expect(exported.deck).toHaveLength(map.deck.length);
    expect(exported.played).toHaveLength(map.played.length);
    expect(exported.active).toHaveLength(map.active.length);
    for (const card of map.active) {
      expect(exported.active).toContain(card.id);
    }
  });
});
