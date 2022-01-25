<template>
  <div class="map">
    <div class="active">
      <div :class="{ double: active.length > 1 }">
        <template v-for="a in active" :key="a.id">
          <card :card="a" :hidden="!hasStarted" />
        </template>
      </div>
    </div>

    <div class="controls">
      <template v-if="hasStarted">
        <chaos-btn v-if="isPlane" />
        <planeswalk-btn
          :title="isPlane ? 'Planeswalk' : 'Resolve'"
          :disabled="revealer && revealer.passive"
          @click="(revealer?.seeder ?? planeswalk)()"
        />
      </template>

      <template v-else>
        <start-btn />
      </template>
    </div>

    <div class="feed">
      <feed :defaultShow="true" />
    </div>
  </div>

  <component
    v-if="revealer && revealed"
    :is="revealer.component"
    :revealed="revealed"
    :config="revealer.config"
    @done="revealer.resolver"
  />
</template>

<script lang="ts">
import _shuffle from 'lodash.shuffle';
import { Options, Vue } from 'vue-class-component';
import { Component } from '@vue/runtime-core';
import { useMain } from '@/store/main';
import { Card as ModelCard, Plane } from '@/model/card';
import { eventBus, EventType } from '@/services/EventBus';
import { Revealed } from '@/model/map';
import { RevealFactory } from '@/components/wall/reveal/RevealFactory';
import { PickedLeft, RevealConfig } from '@/components/wall/reveal/BaseReveal';
import {
  RevealerWallState,
  RevealerSource,
  StateKey,
} from '@/model/wall';

import ChaosBtn from '@/components/btn/ChaosBtn.vue';
import StartBtn from '@/components/btn/StartBtn.vue';
import PlaneswalkBtn from '@/components/btn/PlaneswalkBtn.vue';
import Card from '@/components/classic/Card.vue';
import Feed from '@/components/board/Feed.vue';
import Pick from '@/components/wall/reveal/Pick.vue';
import Scry from '@/components/wall/reveal/Scry.vue';
import Show from '@/components/wall/reveal/Show.vue';


type LocalRevealerConfig = {
  component: Component;
  seeder: () => void;
  resolver: (choices: PickedLeft) => void;
  config: RevealConfig;
}

@Options({
  components: {
    Card, Feed,
    ChaosBtn, StartBtn, PlaneswalkBtn,
    Pick, Scry, Show,
  },
})
export default class ClassicMap extends Vue {
  private store = useMain();

  public created() {
    eventBus.on(EventType.STAIRS_TO_INFINITY, (): void => {
      this.store.reveal({ count: 1 });
    });
    eventBus.on(EventType.POOL_OF_BECOMING, (): void => {
      this.store.reveal({ count: 3 });
    });
  }

  public get active(): Array<ModelCard> {
    return this.store.map.active;
  }

  public get revealed(): Revealed | undefined {
    return this.store.map.revealed;
  }

  public get isPlane(): boolean {
    return this.store.map.active[0].type === 'plane';
  }

  public get hasStarted(): boolean {
    return this.store.map.hasStarted;
  }

  public get revealer(): LocalRevealerConfig | undefined {
    const revealer =
      this.store.map.walls.get<RevealerWallState>(StateKey.REVEALER);

    if (!revealer) {
      return undefined;
    }

    const config = {
      component: RevealFactory.get(revealer.component),
      config: {
        ...revealer,
        mateName: this.store.getPlayerName(revealer.initiator),
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

  public planeswalk(): void {
    this.store.planeswalk();
  }

  public customPlaneswalk(choices: PickedLeft): void {
    this.store.customPlaneswalk({
      planes: choices.picked as Array<Plane>,
    });

    this.putBack({ picked: [], left: choices.left });
  }

  public putBack(choices: PickedLeft): void {
    const payload = {
      top: choices.picked,
      bottom: _shuffle(choices.left),
    };

    this.store.resolveReveal(payload);
  }
}
</script>

<style lang="scss" scoped>
.map {
  @media screen and (max-width: 810px) and (orientation: portrait) {
    grid-template-rows: 8rem auto 2.5rem;
    grid-template-columns: 1fr;
    grid-template-areas:
      "controls"
      "active"
      "feed"
    ;
  }

  @media screen and (max-width: 810px) and (orientation: landscape) {
    grid-template-columns: 1fr 1fr 15rem;
  }

  display: grid;
  grid-template-columns: 1fr 1fr 22rem;
  grid-template-rows: 8rem auto auto;
  column-gap: 1rem;
  row-gap: .5rem;
  grid-template-areas:
    "active active controls "
    "active active .        "
    "active active feed     "
  ;
  height: calc(100vh - 3rem - (3 * 1rem));
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
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;

  button {
    height: 6rem;
    width: 6rem;
  }
}

.feed {
  grid-area: feed;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>
