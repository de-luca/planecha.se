import { Map, MapProps } from '../Map';
import {
  CustomEternitiesPlaneswalkInput,
  EternitiesPlaneswalkInput,
  Exported,
  MapSpecs,
} from '../MapInterface';
import { Tile, TileStatus, ExportedTile } from './Tile';
import { Plane } from '@/model/card';

export enum EternitiesMapSubType {
  SINGLE_DECK = 'SINGLE_DECK',
  DUAL_DECK = 'DUAL_DECK',
}

export enum EternitiesMapDeckType {
  PLANES = 'PLANES',
  ALL = 'ALL',
}

export interface EternitiesMapSpecs extends MapSpecs {
  subType: EternitiesMapSubType;
  deckType: EternitiesMapDeckType;
}

export interface EternitiesMapExported extends Exported {
  specs: EternitiesMapSpecs;
  tiles: Array<ExportedTile>;
}

export interface EternitiesMapProps extends MapProps {
  deckType: EternitiesMapDeckType;
  tiles?: Array<Tile>;
}

export type PlaneswalkInput =
  EternitiesPlaneswalkInput |
  CustomEternitiesPlaneswalkInput;

export abstract class EternitiesMap extends Map {
  protected static readonly activeRange = 1;
  protected static readonly maxRange = 3;
  protected static readonly center: Coordinates = { x: 0, y: 0 };

  protected _deckType: EternitiesMapDeckType;
  protected _tiles: Array<Tile>;

  public constructor(props: EternitiesMapProps) {
    super(props);

    this._deck = props.deck;
    this._active = props.active ?? [this._deck.drawPlane()];
    this._tiles = props.tiles ?? this.initializeTiles();
    this._deckType = props.deckType;
  }

  public abstract get specs(): EternitiesMapSpecs;

  public get tiles(): Array<Tile> {
    return this._tiles;
  }

  private initializeTiles(): Array<Tile> {
    const tiles: Array<Tile> = [
      new Tile(
        { ...EternitiesMap.center },
        TileStatus.ACTIVE,
        this.active as Array<Plane>,
      ),
    ];

    for (let y = EternitiesMap.activeRange * -1; y <= EternitiesMap.activeRange; y++) {
      for (let x = EternitiesMap.activeRange * -1; x <= EternitiesMap.activeRange; x++) {
        if (
          Math.abs(x) + Math.abs(y) <= EternitiesMap.activeRange
          && Math.abs(x) + Math.abs(y) !== 0
        ) {
          tiles.push(new Tile(
            { x, y },
            TileStatus.VISIBLE,
            [this._deck.drawPlane()],
          ));
        }
      }
    }

    return tiles;
  }

  public abstract planeswalk(input: PlaneswalkInput): void;

  protected isHellriding(coords: Coordinates): boolean {
    return Math.abs(coords.x) === 1 && Math.abs(coords.y) === 1;
  }

  public override export(): EternitiesMapExported {
    return {
      ...super.export(),
      specs: this.specs,
      tiles: this.tiles.map(t => t.export()),
    };
  }

  public override restore(state: EternitiesMapExported): void {
    super.restore(state);
    this._tiles = (state.tiles as Array<ExportedTile>).map(Tile.fromExport);
  }
}
