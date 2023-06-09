import { Map } from '../Map';
import { PickedLeft } from '#board/wall/reveal/types';
import { WallConfig } from '#board/wall/types';
import { Phenomenon, Plane } from '#/model/card';
import {
  StateKey,
  PhenomenonWallState,
  RevealerWallState,
  RevealerSource,
} from '#/model/wall';
import {
  EternitiesMap as EternitiesMapModel,
  SingleDeck,
  Tile,
} from '#/model/map/eternities';

interface LocalPhenomenonWallConfig {
  config: WallConfig;
  phenomenon: Phenomenon;
  seeder: (() => void) | null;
}

export abstract class Eternities extends Map {
  public readonly off: number = 4;
  public displayedTile: Tile | null = null;

  public get phenomenonWallConfig(): LocalPhenomenonWallConfig | undefined {
    if ((this.store.map as SingleDeck).destination) {
      let seeder: (() => void) | null = null;
      switch (this.store.map.wallStates.get<RevealerWallState>(StateKey.REVEALER)?.source) {
        case RevealerSource.INTERPLANAR_TUNNEL:
          seeder = () => this.store.reveal({ count: 5, type: Plane });
          break;
        case RevealerSource.SPACIAL_MERGING:
          seeder = () => this.store.reveal({ count: 2, type: Plane });
          break;
      }

      const wall = this.store.map.wallStates.get<PhenomenonWallState>(
        StateKey.PHENOMENON_WALL,
      );

      return {
        seeder,
        phenomenon: this.store.map.active[0] as Phenomenon,
        config: { mateName: wall?.initiator },
      };
    }

    return undefined;
  }

  public unreachable(x: number, y: number): boolean {
    return Math.abs(x - this.off) + Math.abs(y - this.off) > 3;
  }

  public getTile(x: number, y: number): Tile | undefined {
    return (this.store.map as EternitiesMapModel).tiles.find((tile) => {
      return tile.coords.x === x - this.off
        && tile.coords.y === y - this.off;
    });
  }

  public showTileDetails(tile: Tile): void {
    this.displayedTile = tile;
  }

  public hideTileDetails(): void {
    this.displayedTile = null;
  }

  public resolve(): void {
    this.store.resolve();
  }

  public customPlaneswalk(choices: PickedLeft): void {
    super.customPlaneswalk(choices);
    this.store.resolve();
  }
}
