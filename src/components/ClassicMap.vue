<template>
  <div class="map">
    <div class="active">
      <div :class="{ double: active.length > 1 }">
        <template v-for="a in active" :key="a.id">
          <card :card="a" />
        </template>
      </div>
    </div>

    <div class="logs">
      <logs />
    </div>


    <div class="controls">
      <chaos-btn v-if="canChaos" />
      <planeswalk-btn :resolver="revealer?.seeder" :disabled="revealer && revealer.passive" />
    </div>

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
import { Options, Vue } from 'vue-class-component';
import { Component } from '@vue/runtime-core';
import { Handler } from 'mitt';
import _shuffle from 'lodash.shuffle';
import Card from '@/components/board/Card.vue';
import ChaosBtn from '@/components/board/ChaosBtn.vue';
import PlaneswalkBtn from '@/components/board/PlaneswalkBtn.vue';
import Logs from '@/components/board/Logs.vue';
import { ActionTypes, Store, useStore } from '@/store';
import { Card as ModelCard, Plane } from '@/model/card';
import { eventBus, Event, CardEventPayload } from '@/services/EventBus';
import { Revealed } from '@/model/map/MapInterface';
import { PickedLeft, Config } from './board/reveal/BaseReveal';

import Pick from '@/components/board/reveal/Pick.vue';
import Scry from '@/components/board/reveal/Scry.vue';
import Show from '@/components/board/reveal/Show.vue';


type EventHandler = Handler<CardEventPayload>;

type Revealer = {
  passive: boolean;
  component: Component;
  seeder: () => void;
  resolver: (choices: PickedLeft) => void;
  config: Config;
}


@Options({
  components: {
    Card, Logs,
    ChaosBtn, PlaneswalkBtn,
    Pick, Scry, Show,
  },
})
export default class ClassicMap extends Vue {
  private store: Store;
  private revealer: Revealer | null = null;

  public created() {
    this.store = useStore();

    eventBus.on(Event.RESOLVED_REVEAL, () => this.revealer = null);
    eventBus.on(Event.STAIRS_TO_INFINITY, ((payload): void => {
      const passive = (payload as CardEventPayload).passive;
      this.revealer = {
        passive,
        component: Scry,
        seeder: () => {},
        resolver: this.putBack,
        config: { passive, sendShownTo: 'bottom' },
      };

      if (!passive) {
        this.store.dispatch(ActionTypes.REVEAL, { count: 1 })
      }
    }) as EventHandler);
    eventBus.on(Event.POOL_OF_BECOMING, ((payload): void => {
      const passive = (payload as CardEventPayload).passive;
      this.revealer = {
        passive,
        component: Show,
        seeder: () => {},
        resolver: this.putBack,
        config: { passive, sendShownTo: 'bottom' },
      };

      if (!passive) {
        this.store.dispatch(ActionTypes.REVEAL, { count: 3 });
      }
    }) as EventHandler);
    eventBus.on(Event.INTERPLANAR_TUNNEL, ((payload): void => {
      const passive = (payload as CardEventPayload).passive;
      this.revealer = {
        passive,
        component: Pick,
        seeder: () => this.store.dispatch(ActionTypes.REVEAL, { count: 5, type: Plane }),
        resolver: this.customPlaneswalk,
        config: { passive, sendShownTo: 'bottom' }
      };
    }) as EventHandler);
    eventBus.on(Event.SPACIAL_MERGING, ((payload): void => {
      const passive = (payload as CardEventPayload).passive;
      this.revealer = {
        passive,
        component: Show,
        seeder: () => this.store.dispatch(ActionTypes.REVEAL, { count: 2, type: Plane }),
        resolver: this.customPlaneswalk,
        config: { passive, sendShownTo: 'top' }
      };
    }) as EventHandler);
  }

  public get active(): Array<ModelCard> {
    return this.store.getters.active;
  }
  
  public get revealed(): Revealed | undefined {
    return this.store.getters.revealed;
  }
  
  public get canChaos(): boolean {
    return this.store.getters.active[0].type === 'plane';
  }

  public customPlaneswalk(choices: PickedLeft): void {
    this.store.dispatch(ActionTypes.CUSTOM_PLANESWALK, {
      planes: choices.picked as Array<Plane>,
    });

    this.putBack({ picked: [], left: choices.left });
  }
  
  public putBack(choices: PickedLeft): void {
    const payload = {
      top: choices.picked,
      bottom: _shuffle(choices.left),
    };

    this.store.dispatch(ActionTypes.RESOLVE_REVEAL, payload);
  }
}
</script>

<style lang="scss" scoped>
.map {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 11rem auto 40rem;
  column-gap: 3rem;
  row-gap: .5rem;
  grid-template-areas:
    "active active controls "
    "active active .        "
    "active active logs     "
  ;
}

.active {
  grid-area: active;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .double {
    height: 100%;
    position: relative;

    .card-container {
      width: 75%;

      &:hover {
        z-index: 2;
      }
      &:not(:hover) {
        z-index: 1;
      }
      &:last-child {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
}

.controls {
  grid-area: controls;

  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  gap: .5rem;

  & > button {
    height: 10rem;
    width: 10rem;
  }
}

.logs {
  grid-area: logs;
  overflow: scroll;
}
</style>
