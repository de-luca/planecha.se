import { Component } from 'vue';
import { Map } from '../Map';
import { PickedLeft, RevealConfig } from '#/components/game/board/wall/reveal/types';
import { RevealFactory } from '#/components/game/board/wall/reveal/RevealFactory';
import { WallConfig } from '#/components/game/board/wall/types';
import { eventBus, EventType } from '#/services/EventBus';
import { Phenomenon, Plane } from '#/model/card';
import { Revealed } from '#/model/map';
import {
  RevealerWallState,
  RevealerSource,
  StateKey,
  PhenomenonWallState,
} from '#/model/wall';

import { EternitiesMap as EternitiesMapModel, SingleDeck, Tile } from '#/model/map/eternities';


interface LocalRevealerConfig {
  component: Component;
  seeder: () => void;
  resolver: (choices: PickedLeft) => void;
  config: RevealConfig;
}

interface LocalPhenomenonWallConfig {
  config: WallConfig;
  phenomenon: Phenomenon;
}

export abstract class Eternities extends Map {
  public readonly off: number = 4;
  public displayedTile: Tile | null = null;

  public created(): void {
    eventBus.on(EventType.STAIRS_TO_INFINITY, () => this.store.reveal({ count: 1 }));
    eventBus.on(EventType.POOLS_OF_BECOMING, () => this.store.reveal({ count: 3 }));
  }

  public get revealed(): Revealed | undefined {
    return this.store.map.revealed;
  }

  public get revealer(): LocalRevealerConfig | undefined {
    const revealer =
      this.store.map.wallStates.get<RevealerWallState>(StateKey.REVEALER);

    if (!revealer) {
      return undefined;
    }

    const config = {
      component: RevealFactory.get(revealer.component),
      config: {
        ...revealer,
        mateName: revealer.initiator,
      },
    };

    switch (revealer.source) {
      case RevealerSource.STAIRS_TO_INFINITY:
      case RevealerSource.POOLS_OF_BECOMING:
        return {
          ...config,
          seeder: () => { /* NOOP */ },
          resolver: this.putBack,
        };
      case RevealerSource.INTERPLANAR_TUNNEL:
        return {
          ...config,
          seeder: () => this.store.reveal({ count: 5, type: Plane }),
          resolver: this.customPlaneswalk,
        };
      case RevealerSource.SPACIAL_MERGING:
        return {
          ...config,
          seeder: () => this.store.reveal({ count: 2, type: Plane }),
          resolver: this.customPlaneswalk,
        };
    }
  }

  public get phenomenonWall(): LocalPhenomenonWallConfig | undefined {
    if ((this.store.map as SingleDeck).destination) {
      const wall = this.store.map.wallStates.get<PhenomenonWallState>(
        StateKey.PHENOMENON_WALL,
      );

      return {
        phenomenon: this.store.map.active[0] as Phenomenon,
        config: {
          mateName: wall?.initiator,
        },
      };
    }

    return undefined;
  }

  public get hasStarted(): boolean {
    return this.store.map.hasStarted;
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
    this.store.planeswalk({
      planes: choices.picked as Array<Plane>,
    });

    this.putBack({ picked: [], left: choices.left });
    this.store.resolve();
  }
}
