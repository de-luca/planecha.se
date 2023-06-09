<template>
  <div class="active" :class="{ buncha: active.length > 1 }">
    <card v-for="a in active" :key="a.id" :card="a" :hidden="!hasStarted" class="card" />
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
import { Component as VueComponent } from 'vue';
import { Map } from '../Map';
import { Op } from '#/store/main';
import { Counter, Card as ModelCard, Plane } from '#/model/card';
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
import Card from '#/components/controls/Card.vue';
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
  components: { Card, Pick, Scry, Show, StackWall },
})
export default class Single extends Map {
  public shown: ModelCard | null = null;

  public created() {
    eventBus.on(EventType.STAIRS_TO_INFINITY, (): void => {
      this.store.reveal({ count: 1 });
    });
    eventBus.on(EventType.POOLS_OF_BECOMING, (): void => {
      this.store.reveal({ count: 3 });
    });
    eventBus.on(EventType.NORNS_SEEDCORE, (): void => {
      this.store.reveal({ count: 1, type: Plane });
    });
    eventBus.on(EventType.THE_FERTILE_LANDS_OF_SAULVINIA, (): void => {
      this.store.reveal({ count: 1, type: Plane });
    });
  }

  public get gridClass(): [string, string] {
    const count = this.active.length;
    switch (true) {
      case count < 5:
        return ['x2', 'y2'];
      case count >=5 && count < 7:
        return ['x3', 'y2'];
      case count >= 7:
        return ['x3', 'y3'];
    }
    return ['', ''];
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
          resolver: (choices) => {
            this.store.pushOpToStack(Op.RESOLVE_REVEAL, {
              top: choices.picked,
              bottom: shuffle(choices.left),
            });
            choices.left.forEach(card => this.store.pushOpToStack(Op.CHAOS, { card }));
            this.store.resolveOpStack();
          },
        };
      case RevealerSource.NORNS_SEEDCORE:
        return {
          ...config,
          seeder: () => { /* NOOP */ },
          resolver: (choices) => {
            this.store.addActivePlane({ plane: choices.picked.pop() as Plane });
            this.store.resolveReveal({ top: [], bottom: shuffle(choices.left) });
          },
        };
      case RevealerSource.THE_FERTILE_LANDS_OF_SAULVINIA:
        return {
          ...config,
          seeder: () => { /* NOOP */ },
          resolver: (choices) => {
            console.log(choices);
            this.store.pushOpToStack(Op.RESOLVE_REVEAL, {
              top: [],
              bottom: shuffle([...choices.picked, ...choices.left]),
            });
            choices.picked.forEach(card => this.store.pushOpToStack(Op.CHAOS, { card }));
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

  public getCounters(card: ModelCard): Counter | undefined {
    if (card instanceof Plane) {
      return card.counter;
    }
    return undefined;
  }

  public planeswalk(): void {
    if (this.revealer?.seeder) {
      return this.revealer.seeder();
    }
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
.card {
  background: none;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    z-index: 2;
  }
  &:not(:hover) {
    z-index: 1;
  }
}

.active {
  grid-area: active;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  &.buncha {
    height: auto;
    padding-top: 2rem;
    padding-bottom: 2rem;
    gap: 2.5rem
  }
}
</style>
