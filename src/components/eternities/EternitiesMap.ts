import _shuffle from 'lodash.shuffle';
import { Component } from 'vue';
import { ActionTypes, Store, useStore } from '@/store';
import { eventBus, EventType } from '@/services/EventBus';
import { Phenomenon, Plane } from '@/model/card';
import { PickedLeft, RevealConfig } from '../reveal/BaseReveal';
import { Vue } from 'vue-class-component';
import Scry from '@/components/reveal/Scry.vue';
import Pick from '@/components/reveal/Pick.vue';
import Show from '@/components/reveal/Show.vue';
import {
  Coordinates,
  Revealed,
  Tile,
} from '@/model/map';
import { Revealer, RevealerMode, RevealerSource } from '@/model/state/Revealer';
import { StateKey } from '@/model/state/MapState';

type RevealerConfig = {
  passive: boolean;
  component: Component;
  seeder: () => void;
  resolver: (choices: PickedLeft) => void;
  config: RevealConfig;
}

type PhenomenonWallConfig = {
  passive: boolean;
  phenomenon: Phenomenon;
}

const RevealerMap: Record<RevealerMode, Component> = {
  [RevealerMode.SCRY]: Scry,
  [RevealerMode.SHOW]: Show,
  [RevealerMode.PICK]: Pick,
}

export class EternitiesMap extends Vue {
  protected readonly off: number = 4;
  protected store: Store;

  protected setUp(): void {
    this.store = useStore();

    eventBus.on(EventType.STAIRS_TO_INFINITY, (): void => {
      this.store.dispatch(ActionTypes.REVEAL, { count: 1 });
    });
    eventBus.on(EventType.POOL_OF_BECOMING, (): void => {
      this.store.dispatch(ActionTypes.REVEAL, { count: 3 });
    });
  }

  public get revealed(): Revealed | undefined {
    return this.store.getters.revealed;
  }

  public get revealer(): RevealerConfig | undefined {
    const revealer =
      this.store.getters.map.state.get(StateKey.REVEALER) as Revealer | undefined;

    if (!revealer) {
      return undefined;
    }

    const config = {
      passive: revealer.passive,
      component: RevealerMap[revealer.component],
      config: {
        sendShownTo: revealer.sendShownTo,
        passive: revealer.passive,
        mateName: revealer.initiator
          ? this.store.getters.mates.get(revealer.initiator)
          : undefined,
      },
    };

    switch (revealer.source) {
      case RevealerSource.STAIRS_TO_INFINITY:
      case RevealerSource.POOL_OF_BECOMING:
        return {
          ...config,
          seeder: () => { },
          resolver: this.putBack,
        };
      case RevealerSource.INTERPLANAR_TUNNEL:
        return {
          ...config,
          seeder: () => this.store.dispatch(ActionTypes.REVEAL, { count: 5, type: Plane }),
          resolver: this.customPlaneswalk,
        };
      case RevealerSource.SPACIAL_MERGING:
        return {
          ...config,
          seeder: () => this.store.dispatch(ActionTypes.REVEAL, { count: 2, type: Plane }),
          resolver: this.customPlaneswalk,
        };
    }
  }

  public get phenomenonWall(): PhenomenonWallConfig | undefined {
    if (this.store.getters.map.destination) {
      const c = {
        passive: this.store.getters.map.state.get(StateKey.PHENOMENON_WALL)?.passive ?? false,
        phenomenon: this.store.getters.map.active[0] as Phenomenon,
      };

      return c;
    }

    return undefined;
  }

  public get hasStarted(): boolean {
    return this.store.getters.map.hasStarted;
  }

  public unreachable(x: number, y: number): boolean {
    return Math.abs(x - this.off) + Math.abs(y - this.off) > 3;
  }

  public getTile(x: number, y: number): Tile | undefined {
    return this.store.getters.tiles.find((tile) => {
      return tile.coordinates.x === x - this.off
        && tile.coordinates.y === y - this.off;
    });
  }

  public putBack(choices: PickedLeft): void {
    const payload = {
      top: choices.picked,
      bottom: _shuffle(choices.left),
    };

    this.store.dispatch(ActionTypes.RESOLVE_REVEAL, payload);
  }

  public start(): void {
    this.store.dispatch(ActionTypes.START_ETERNITIES);
  }

  public planeswalk(coordinates: Coordinates): void {
    this.store.dispatch(ActionTypes.PLANESWALK, { coordinates });
  }

  public customPlaneswalk(choices: PickedLeft): void {
    console.log(choices);
    this.store.dispatch(ActionTypes.CUSTOM_PLANESWALK, {
      planes: choices.picked as Array<Plane>,
    });

    this.putBack({ picked: [], left: choices.left });
    this.store.dispatch(ActionTypes.PLANESWALK_FROM_PHENOMENON);
  }
}
