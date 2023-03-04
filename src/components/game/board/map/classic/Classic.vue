<template>
  <div class="map">
    <div class="active">
      <div :class="{ double: active.length > 1 }">
        <card v-for="a in active" :key="a.id" :card="a" :hidden="!hasStarted" />
      </div>
    </div>

    <div class="controls">
      <template v-if="hasStarted">
        <chaos-btn v-if="isPlane" @click="chaos" />
        <planeswalk-btn
          :title="isPlane ? 'Planeswalk' : 'Resolve'"
          @click="(revealer?.seeder ?? planeswalk)()"
        />
      </template>
      <start-btn v-else />
    </div>

    <div class="feed">
      <feed :defaultShow="shouldDisplayFeed" />
    </div>
  </div>

  <stack-wall v-if="showStackWall" @done="customChaos" />

  <component
    v-if="revealer && revealed"
    :is="revealer.component"
    :revealed="revealed"
    :config="revealer.config"
    @done="revealer!.resolver"
  />
</template>

<script lang="ts">
import shuffle from 'lodash.shuffle';
import { Component } from 'vue-facing-decorator';
import { Component as VueComponent } from '@vue/runtime-core';
import { Map } from '../Map';
import { Op } from '#/store/main';
import { Card as ModelCard, Plane } from '#/model/card';
import { eventBus, EventType } from '#/services/EventBus';
import { Revealed } from '#/model/map';
import {
  RevealerWallState,
  RevealerSource,
  StateKey,
} from '#/model/wall';

import { RevealFactory } from '#board/wall/reveal/RevealFactory';
import { PickedLeft, RevealConfig } from '#board/wall/reveal/types';

import StackWall from '#board/wall/StackWall.vue';
import ChaosBtn from '#/components/controls/ChaosBtn.vue';
import StartBtn from '#/components/controls/StartBtn.vue';
import PlaneswalkBtn from '#/components/controls/PlaneswalkBtn.vue';
import Card from '#board/map/classic/Card.vue';
import Feed from '#board/feed/Feed.vue';
import Pick from '#board/wall/reveal/Pick.vue';
import Scry from '#board/wall/reveal/Scry.vue';
import Show from '#board/wall/reveal/Show.vue';


type LocalRevealerConfig = {
  component: VueComponent;
  seeder: () => void;
  resolver: (choices: PickedLeft) => void;
  config: RevealConfig;
}

@Component({
  components: {
    Card, Feed,
    ChaosBtn, StartBtn, PlaneswalkBtn,
    Pick, Scry, Show,
    StackWall,
  },
})
export default class Classic extends Map {
  public created() {
    eventBus.on(EventType.STAIRS_TO_INFINITY, (): void => {
      this.store.reveal({ count: 1 });
    });
    eventBus.on(EventType.POOLS_OF_BECOMING, (): void => {
      this.store.reveal({ count: 3 });
    });
  }

  public get shouldDisplayFeed(): boolean {
    return window.matchMedia(
      'screen and (min-width: 800px) and (orientation: landscape)',
    ).matches;
  }

  public get active(): Array<ModelCard> {
    return this.store.map.active;
  }

  public get revealed(): Revealed | undefined {
    return this.store.map.revealed;
  }

  public get isPlane(): boolean {
    return this.store.map.active[0] instanceof Plane;
  }

  public get hasStarted(): boolean {
    return this.store.map.hasStarted;
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
        return {
          ...config,
          seeder: () => { /* NOOP */ },
          resolver: this.putBack,
        };
      case RevealerSource.POOLS_OF_BECOMING:
        return {
          ...config,
          seeder: () => { /* NOOP */ },
          resolver: (choices: PickedLeft) => {
            this.store.pushOpToStack(Op.RESOLVE_REVEAL,{
              top: choices.picked,
              bottom: shuffle(choices.left),
            });
            choices.left.forEach(card => this.store.pushOpToStack(Op.CHAOS, { card }));
            this.store.resolveOpStack();
          },
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
    this.store.planeswalk({});
  }

  private customPlaneswalk(choices: PickedLeft): void {
    this.store.planeswalk({
      planes: choices.picked as Array<Plane>,
    });

    this.putBack({ picked: [], left: choices.left });
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
