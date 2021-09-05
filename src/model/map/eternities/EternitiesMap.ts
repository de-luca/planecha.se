import { Plane } from "@/model/card";
import { Map, MapProps } from "../Map";
import {
  EternitiesMapDeckType,
  EternitiesMapSpecs,
  Exported,
  Tile,
  TileStatus
} from "../MapInterface";

export interface EternitiesMapExported extends Exported {
  specs: EternitiesMapSpecs;
}

export interface EternitiesMapProps extends MapProps {
  deckType: EternitiesMapDeckType;
  tiles?: Array<Tile>;
}

export abstract class EternitiesMap extends Map {
  protected static readonly activeRange = 1;
  protected static readonly maxRange = 3;
  protected static readonly center: Coordinates = { x: 0, y: 0 };

  protected deckType: EternitiesMapDeckType;

  protected constructor(props: EternitiesMapProps) {
    super(props);

    this.deck = props.deck;
    this.active = props.active ?? [this.deck.drawPlane().card];
    this.tiles = props.tiles ?? this.initializeTiles();
    this.deckType = props.deckType;
  }

  public override get specs(): EternitiesMapSpecs {
    throw new Error('Method not implemented.');
  }

  private initializeTiles(): Array<Tile> {
    const tiles: Array<Tile> = [{
      state: TileStatus.ACTIVE,
      coords: { ...EternitiesMap.center },
      plane: this.active as Array<Plane>,
    }];

    for (let y = EternitiesMap.activeRange * -1; y <= EternitiesMap.activeRange; y++) {
      for (let x = EternitiesMap.activeRange * -1; x <= EternitiesMap.activeRange; x++) {
        if (
          Math.abs(x) + Math.abs(y) <= EternitiesMap.activeRange
          && Math.abs(x) + Math.abs(y) !== 0
        ) {
          tiles.push({
            coords: { x, y },
            state: TileStatus.VISIBLE,
            plane: [this.deck.drawPlane().card],
          });
        }
      }
    }

    return tiles;
  }

  protected isHellriding(coords: Coordinates): boolean {
    return Math.abs(coords.x) === 1 && Math.abs(coords.y) === 1;
  }

  public export(): EternitiesMapExported {
    return {
      ...super.export(),
      specs: this.specs,
      tiles: this.tiles.map(t => ({
        coords: t.coords,
        state: t.state,
        plane: t.plane.map(p => p.export()),
      })),
    };
  }
}
