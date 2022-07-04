import _shuffle from 'lodash.shuffle';
import { Component } from 'vue';
import { Vue } from 'vue-class-component';
import { useMain } from '@/store/main';
import { eventBus, EventType } from '@/services/EventBus';
import { Phenomenon, Plane } from '@/model/card';
import { PickedLeft, RevealConfig } from '../wall/reveal/BaseReveal';
import { RevealFactory } from '../wall/reveal/RevealFactory';
import { WallConfig } from '../wall/WallProps';
import { Revealed } from '@/model/map';
import {
  RevealerWallState,
  RevealerSource,
  StateKey,
  PhenomenonWallState,
} from '@/model/wall';

import ChaosBtn from '@/components/btn/ChaosBtn.vue';
import StartBtn from '@/components/btn/StartBtn.vue';
import { EternitiesMap as EternitiesMapModel, SingleDeck, Tile } from '@/model/map/eternities';


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

export class EternitiesMap extends Vue {
  protected readonly off: number = 4;
  protected store = useMain();
  protected displayedTile: Tile | null = null;

  protected setUp(): void {
    eventBus.on(EventType.STAIRS_TO_INFINITY, (): void => {
      this.store.reveal({ count: 1 });
    });
    eventBus.on(EventType.POOL_OF_BECOMING, (): void => {
      this.store.reveal({ count: 3 });
    });
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
      case RevealerSource.POOL_OF_BECOMING:
        return {
          ...config,
          seeder: () => {},
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

  public get btnComponent(): Component {
    return this.hasStarted ? ChaosBtn : StartBtn;
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

  public putBack(choices: PickedLeft): void {
    const payload = {
      top: choices.picked,
      bottom: _shuffle(choices.left),
    };

    this.store.resolveReveal(payload);
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
