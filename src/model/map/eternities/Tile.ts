import { DeckProvider } from '@/services/DeckProvider';
import { Container } from 'typedi';
import { ExportedCard, Plane } from '../../card';

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
  private _coords: Coordinates;
  private _state: TileStatus;
  private _plane: Array<Plane>;

  public constructor(
    coords: Coordinates,
    state: TileStatus,
    plane: Array<Plane>,
  ) {
    this._coords = coords;
    this._state = state;
    this._plane = plane;
  }

  public get coords(): Coordinates {
    return this._coords;
  }

  public get state(): TileStatus {
    return this._state;
  }

  public set state(status: TileStatus) {
    this._state = status;
  }

  public get plane(): Array<Plane> {
    return this._plane;
  }

  public set plane(planes: Array<Plane>) {
    this._plane = planes;
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
      coords: { ...this._coords },
      state: this._state,
      plane: this._plane.map(p => p.export()),
    };
  }
}
