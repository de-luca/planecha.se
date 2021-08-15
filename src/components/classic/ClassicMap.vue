<template>
  <div class="map">
    <div class="active">
      <div :class="{ double: active.length > 1 }">
        <template v-for="a in active" :key="a.id">
          <card :card="a" />
        </template>
      </div>
    </div>

    <div class="box feed">
      <feed />
    </div>

    <div class="controls">
      <chaos-btn v-if="canChaos" />
      <planeswalk-btn
        :resolver="revealer?.seeder"
        :disabled="revealer && revealer.passive"
      />
    </div>

    {{ revealer }}

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
import { Options, Vue } from 'vue-class-component';
import { Component } from '@vue/runtime-core';
import { ActionTypes, Store, useStore } from '@/store';
import { Card as ModelCard, Plane } from '@/model/card';
import { eventBus, EventType } from '@/services/EventBus';
import { Revealed } from '@/model/map';
import ChaosBtn from '@/components/ChaosBtn.vue';
import PlaneswalkBtn from '@/components/PlaneswalkBtn.vue';
import Card from '@/components/classic/Card.vue';
import Feed from '@/components/classic/Feed.vue';
import Pick from '@/components/reveal/Pick.vue';
import Scry from '@/components/reveal/Scry.vue';
import Show from '@/components/reveal/Show.vue';
import { PickedLeft, RevealConfig } from '../reveal/BaseReveal';
import { RevealerMode, RevealerSource } from '@/model/state/Revealer';

type Revealer = {
  passive: boolean;
  component: Component;
  seeder: () => void;
  resolver: (choices: PickedLeft) => void;
  config: RevealConfig;
}

const RevealerMap: Record<RevealerMode, Component> = {
  [RevealerMode.SCRY]: Scry,
  [RevealerMode.SHOW]: Show,
  [RevealerMode.PICK]: Pick,
}

@Options({
  components: {
    Card, Feed,
    ChaosBtn, PlaneswalkBtn,
    Pick, Scry, Show,
  },
})
export default class ClassicMap extends Vue {
  private store: Store;

  public created() {
    this.store = useStore();

    eventBus.on(EventType.STAIRS_TO_INFINITY, (): void => {
      this.store.dispatch(ActionTypes.REVEAL, { count: 1 });
    });
    eventBus.on(EventType.POOL_OF_BECOMING, (): void => {
      this.store.dispatch(ActionTypes.REVEAL, { count: 3 });
    });
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

  public get revealer(): Revealer | undefined {
    const revealer = this.store.getters.map.state.revealer;

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
          seeder: () => {},
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

.feed {
  grid-area: logs;
  overflow: scroll;
}
</style>
