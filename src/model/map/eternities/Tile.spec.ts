import { describe, expect, it } from 'vitest';
import { Container } from 'typedi';
import { Tile, TileStatus } from './Tile';
import { DeckProvider } from '@/services/DeckProvider';

const deckProvider = Container.get(DeckProvider);
const cardId = '0b8a0cad-92df-45a1-a3cc-561be2f06778';

describe('Tile.fromExport', () => {
  it('returns a tile from an exported payload', () => {
    const tile = Tile.fromExport({
      coords: { x: 1, y: 0 },
      state: TileStatus.ACTIVE,
      plane: [{ id: cardId, counters: undefined }],
    });

    expect(tile.coords).toEqual({ x: 1, y: 0 });
    expect(tile.state).toEqual(TileStatus.ACTIVE);
    expect(tile.plane).toHaveLength(1);
    expect(tile.plane[0].id).toEqual(cardId);
  });
});

describe('Tile.export', () => {
  it('returns an exported Tile', () => {
    const tile = new Tile(
      { x: 1, y: 0 },
      TileStatus.ACTIVE,
      [deckProvider.getCard(cardId)],
    );

    expect(tile.export()).toEqual({
      coords: { x: 1, y: 0 },
      state: 'active',
      plane: [ { id: cardId, counters: undefined } ],
    });
  });
});
