import { DeckProvider } from '@/services/DeckProvider';
import { Container } from 'typedi';
import { ExportedCard, Plane } from '../card';

export enum TileStatus {
  ACTIVE = 'active',
  VISIBLE = 'visible',
}

export interface ExportedTile {
  coords: Coordinates;
  state: TileStatus;
  plane: Array<ExportedCard>;
}

export class Tile {
  public coords: Coordinates;
  public state: TileStatus;
  public plane: Array<Plane>;

  public constructor(
    coords: Coordinates,
    state: TileStatus,
    plane: Array<Plane>,
  ) {
    this.coords = coords;
    this.state = state;
    this.plane = plane;
  }

  public static fromExport(tile: ExportedTile): Tile {
    return new Tile(
      tile.coords,
      tile.state,
      Container.get(DeckProvider).getPileWithState(tile.plane),
    );
  }

  public export(): ExportedTile {
    return {
      coords: { ...this.coords },
      state: this.state,
      plane: this.plane.map(p => p.export()),
    };
  }
}
