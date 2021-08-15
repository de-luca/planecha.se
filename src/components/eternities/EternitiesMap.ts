import _shuffle from 'lodash.shuffle';
import { Component } from 'vue';
import { ActionTypes, Store, useStore } from '@/store';
import { eventBus, EventType } from '@/services/EventBus';
import { Phenomenon as PhenomenonModel, Plane } from '@/model/card';
import { Config, PickedLeft } from '../reveal/BaseReveal';
import { Vue } from 'vue-class-component';
import Scry from '@/components/reveal/Scry.vue';
import Pick from '@/components/reveal/Pick.vue';
import Show from '@/components/reveal/Show.vue';
import {
  Coordinates,
  Revealed,
  Tile,
} from '@/model/map';

export type Revealer = {
  passive: boolean;
  component: Component;
  seeder: () => void;
  resolver: (choices: PickedLeft) => void;
  config: Config;
}

export class EternitiesMap extends Vue {
  protected readonly off: number = 4;
  protected store: Store;
  protected revealer: Revealer | null = null;

  protected setUp(): void {
    this.store = useStore();

    eventBus.on(EventType.RESOLVED_REVEAL, () => this.revealer = null);
    eventBus.on(EventType.STAIRS_TO_INFINITY, (payload): void => {
      this.revealer = {
        passive: payload.passive,
        component: Scry,
        seeder: () => { },
        resolver: this.putBack,
        config: {
          sendShownTo: 'bottom',
          passive: payload.passive,
          mateName: payload.initiator ? this.store.getters.mates.get(payload.initiator) : undefined,
        },
      };

      if (!payload.passive) {
        this.store.dispatch(ActionTypes.REVEAL, { count: 1 });
      }
    });
    eventBus.on(EventType.POOL_OF_BECOMING, (payload): void => {
      this.revealer = {
        passive: payload.passive,
        component: Show,
        seeder: () => { },
        resolver: this.putBack,
        config: {
          sendShownTo: 'bottom',
          passive: payload.passive,
          mateName: payload.initiator ? this.store.getters.mates.get(payload.initiator) : undefined,
        },
      };

      if (!payload.passive) {
        this.store.dispatch(ActionTypes.REVEAL, { count: 3 });
      }
    });
    eventBus.on(EventType.INTERPLANAR_TUNNEL, (payload): void => {
      this.revealer = {
        passive: payload.passive,
        component: Pick,
        seeder: () => this.store.dispatch(ActionTypes.REVEAL, { count: 5, type: Plane }),
        resolver: this.customPlaneswalk,
        config: {
          sendShownTo: 'bottom',
          passive: payload.passive,
          mateName: payload.initiator ? this.store.getters.mates.get(payload.initiator) : undefined,
        },
      };
    });
    eventBus.on(EventType.SPACIAL_MERGING, (payload): void => {
      this.revealer = {
        passive: payload.passive,
        component: Show,
        seeder: () => this.store.dispatch(ActionTypes.REVEAL, { count: 2, type: Plane }),
        resolver: this.customPlaneswalk,
        config: {
          sendShownTo: 'top',
          passive: payload.passive,
          mateName: payload.initiator ? this.store.getters.mates.get(payload.initiator) : undefined,
        },
      };
    });
  }

  public get revealed(): Revealed | undefined {
    return this.store.getters.revealed;
  }

  public get inPlaneswalkPhenomenon(): PhenomenonModel | undefined {
    return this.store.getters.map.destination
      ? this.store.getters.active[0]
      : undefined;
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
