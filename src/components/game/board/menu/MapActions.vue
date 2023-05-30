<template>
  <div class="actions">
    <template v-if="hasStarted">
      <Tip v-if="!isEternities">
        <template #btn>
          <button
            class="planeswalk button is-ghost"
            :title="isPlane ? 'Planeswalk' : 'Resolve'"
            @click="$emit('planeswalk')"
          >
            <Planeswalk class="icn is-primary" />
          </button>
        </template>
        <template #tip>{{ isPlane ? 'Planeswalk' : 'Resolve' }}</template>
      </Tip>
      <Tip>
        <template #btn>
          <button class="chaos button is-ghost" :disabled="!isPlane" @click="$emit('chaos')">
            <Chaos class="icn is-primary" />
          </button>
        </template>
        <template #tip>{{ isPlane ? 'Chaos' : 'Chaos not available' }}</template>
      </Tip>
    </template>
    <Tip v-else>
      <template #btn>
        <button class="button is-ghost" @click="start">
          <fa icon="play" fixed-width shake size="lg" />
        </button>
      </template>
      <template #tip>Start Game</template>
    </Tip>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import Tip from './Tip.vue';
import { Plane } from '#/model/card';
import { EternitiesMap } from '#/model/map/eternities';
import { useMain } from '#/store/main';

import { Chaos, Planeswalk } from '#/components/svgs';

@Component({
  emits: ['chaos', 'planeswalk'],
  components: { Chaos, Planeswalk, Tip },
})
export default class MapActions extends Vue {
  private store = useMain();

  public get isEternities(): boolean {
    return this.store.map instanceof EternitiesMap;
  }

  public get hasStarted(): boolean {
    return this.store.map.hasStarted;
  }

  public get isPlane(): boolean {
    return this.store.map.active[0] instanceof Plane;
  }

  public start() {
    this.store.startGame();
  }
}
</script>

<style lang="scss">
.actions {
  height: 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .planeswalk, .chaos {
    svg path {
      fill: var(--brand-color-secondary);
    }
    &:hover svg path {
      fill: var(--brand-color-primary);
    }
  }

  .planeswalk {
    height: 3.5rem;
  }

  .chaos svg {
    width: 1.5rem;
  }
}
</style>
