<template>
  <div class="actions">
    <template v-if="hasStarted">
      <Tip v-if="!isEternities">
        <template #btn>
          <button
            class="planeswalk button is-ghost"
            :title="isPhenomenon ? 'Resolve' : 'Planeswalk'"
            :disabled="disabled"
            @click="$emit('planeswalk')"
          >
            <Planeswalk
              class="icn"
              :class="{ 'fa-shake': isPhenomenon, 'is-phenomenon': isPhenomenon }"
            />
          </button>
        </template>
        <template #tip>{{ isPhenomenon ? 'Resolve' : 'Planeswalk' }}</template>
      </Tip>
      <Tip>
        <template #btn>
          <button
            class="chaos button is-ghost"
            :disabled="disabled || isPhenomenon"
            @click="$emit('chaos')"
          >
            <Chaos class="icn" />
          </button>
        </template>
        <template #tip>{{ isPhenomenon ? 'Chaos not available' : 'Chaos' }}</template>
      </Tip>
      <LookAtBtn :disabled="disabled || isPhenomenon" />
    </template>
    <Tip v-else>
      <template #btn>
        <button class="button is-ghost" @click="start">
          <fa icon="play" fixed-width shake size="lg" />
        </button>
      </template>
      <template #tip>Start game</template>
    </Tip>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import Tip from './Tip.vue';
import LookAtBtn from './LookAtBtn.vue';
import { Phenomenon } from '#/model/card';
import { EternitiesMap } from '#/model/map/eternities';
import { useMain } from '#/store/main';

import { Chaos, Planeswalk } from '#/components/svgs/dices';

@Component({
  emits: ['chaos', 'planeswalk'],
  components: { Chaos, Planeswalk, LookAtBtn, Tip },
})
export default class MapActions extends Vue {
  @Prop({ required: true })
  public disabled: boolean;

  private store = useMain();

  public get isEternities(): boolean {
    return this.store.map instanceof EternitiesMap;
  }

  public get hasStarted(): boolean {
    return this.store.map.hasStarted;
  }

  public get isPhenomenon(): boolean {
    return this.store.map.active[0] instanceof Phenomenon;
  }

  public start() {
    this.store.startGame();
  }
}
</script>

<style lang="scss" scoped>
.actions {
  height: 10rem;
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

    .icn.is-phenomenon {
      filter:
        drop-shadow(0 0 5px #DC143C)
        drop-shadow(0 0 5px #DC143C)
        drop-shadow(0 0 5px #DC143C)
      ;
    }
  }

  .chaos svg {
    width: 1.5rem;
  }
}
</style>
