<template>
  <div class="map">
    <template v-for="y in 7" :key="y">
      <tile
        v-for="x in 7"
        :key="x"
        :tile="getTile(x, y)"
        :x="x - off"
        :y="y - off"
        :hidden="!hasStarted"
        @start="start"
      />
    </template>

    <chaos-btn class="chaos" />

    <phenomenon
      v-if="inPlaneswalkPhenomenon"
      :phenomenon="inPlaneswalkPhenomenon"
      :resolver="revealer?.seeder"
      :disabled="revealer && revealer.passive"
    ></phenomenon>

    <component
      v-if="revealer && revealed"
      :is="revealer.component"
      :revealed="revealed"
      :config="revealer.config"
      @done="revealer.resolver"
    />
  </div>
</template>

<script lang="ts">
import _shuffle from 'lodash.shuffle';
import { Component } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { ActionTypes, Store, useStore } from '@/store';
import { Revealed, Tile as TileModel } from '@/model/map/MapInterface';
import { Phenomenon as PhenomenonModel, Plane } from '@/model/card';
import { eventBus, EventType } from '@/services/EventBus';
import { Config, PickedLeft } from './reveal/BaseReveal';
import ChaosBtn from '@/components/ChaosBtn.vue';
import Tile from '@/components/eternities/Tile.vue';
import Phenomenon from '@/components/eternities/Phenomenon.vue';
import Scry from '@/components/reveal/Scry.vue';
import Pick from '@/components/reveal/Pick.vue';
import Show from '@/components/reveal/Show.vue';
import { SingleDeckAllCards } from '@/model/map';

type Revealer = {
  passive: boolean;
  component: Component;
  seeder: () => void;
  resolver: (choices: PickedLeft) => void;
  config: Config;
}

@Options({
  components: {
    Tile, ChaosBtn, Phenomenon,
    Scry, Pick, Show,
  },
})
export default class EternitiesMap extends Vue {
  private readonly off = 4;
  private store: Store;
  private revealer: Revealer | null = null;

  public created(): void {
    this.store = useStore();

    eventBus.on(EventType.RESOLVED_REVEAL, () => this.revealer = null);
    eventBus.on(EventType.STAIRS_TO_INFINITY, (payload): void => {
      this.revealer = {
        passive: payload.passive,
        component: Scry,
        seeder: () => {},
        resolver: this.putBack,
        config: {
          sendShownTo: 'bottom',
          passive: payload.passive,
          mateName: payload.mateId ? this.store.getters.mates.get(payload.mateId) : undefined,
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
        seeder: () => {},
        resolver: this.putBack,
        config: {
          sendShownTo: 'bottom',
          passive: payload.passive,
          mateName: payload.mateId ? this.store.getters.mates.get(payload.mateId) : undefined,
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
          mateName: payload.mateId ? this.store.getters.mates.get(payload.mateId) : undefined,
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
          mateName: payload.mateId ? this.store.getters.mates.get(payload.mateId) : undefined,
        },
      };
    });
  }

  public get revealed(): Revealed | undefined {
    return this.store.getters.revealed;
  }

  public get inPlaneswalkPhenomenon(): PhenomenonModel | undefined {
    return (this.store.getters.map as SingleDeckAllCards).destination
      ? this.store.getters.active[0]
      : undefined;
  }

  public get hasStarted(): boolean {
    return this.store.getters.map.hasStarted;
  }

  public unreachable(x: number, y: number): boolean {
    return Math.abs(x - this.off) + Math.abs(y - this.off) > 3;
  }

  public getTile(x: number, y: number): TileModel | undefined {
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

  public customPlaneswalk(choices: PickedLeft): void {
    console.log(choices);
    this.store.dispatch(ActionTypes.CUSTOM_PLANESWALK, {
      planes: choices.picked as Array<Plane>,
    });

    this.putBack({ picked: [], left: choices.left });
  }
}
</script>

<style lang="scss" scoped>
.map {
  position: relative;

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, auto);
  gap: 1rem;
  align-content: center;
}

.chaos {
  position: absolute;
  top: 0;
  right: 0;
  height: 10rem;
  width: 10rem;
}
</style>
