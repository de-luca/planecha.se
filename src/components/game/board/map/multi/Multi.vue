<template>
  <div class="map" :class="[layout]">
    <div class="active" v-for="a in actives">
      <card v-if="a.active.length === 1" :card="a.active[0]" :hidden="!hasStarted" />
      <div v-else @click="shown = a">
        <fa icon="ellipsis" size="10x" />
      </div>
      <h1>{{ a.mate }}</h1>
    </div>
  </div>

  <modal v-if="shown" :scroll="true" @close="shown = null">
    <div class="details">
      <h1 class="title">{{ shown.yours ? 'Your board' : shown.mate + '\'s board' }}</h1>
      <card v-for="card in shown.active" :key="card.id" :card="card" :ro="!shown.yours" />
    </div>
  </modal>

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
import { Card as ModelCard, Plane } from '#/model/card';
import { eventBus, EventType } from '#/services/EventBus';
import { Revealed } from '#/model/map';
import { Multi as MultiMap } from '#/model/map/multi/Multi';
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


interface LocalRevealerConfig {
  component: VueComponent;
  seeder: () => void;
  resolver: (choices: PickedLeft) => void;
  config: RevealConfig;
}

interface Active {
  yours: boolean;
  mate: string;
  active: Array<ModelCard>;
}


@Component({
  components: { Card, Pick, Scry, Show, StackWall},
})
export default class Multi extends Map {
  public shown: Active | null = null;

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

  public get layout(): 'x4' | 'x9' {
    return this.actives.length <= 4 ? 'x4' : 'x9';
  }

  public get actives(): Array<Active> {
    return [{
      yours: true,
      mate: this.store.getMateName(),
      active: this.store.map.active,
    }].concat(
      [...(this.store.map as MultiMap).mateStates.entries()]
        .map(([peer, map]) => ({
          yours: false,
          mate: this.store.getMateName(peer),
          active: map.active,
        })),
    );
  }

  public get revealed(): Revealed | undefined {
    return this.store.map.revealed;
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
.map {
  grid-area: active;
  display: grid;
  grid-auto-flow: dense;
  gap: 1rem;

  height: 100%;
  padding: 1rem;

  &.x4 {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }

  &.x9 {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }

  .active {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    padding-top: 2rem;

    div:first-of-type {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
}

.details {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  padding: 2.5rem 1rem;
}
</style>
