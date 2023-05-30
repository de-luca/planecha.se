<template>
  <div class="status">
    <Tip>
      <template #btn>
        <div class="info" title="Remaining cards">
          <fa icon="layer-group" fixed-width size="lg" />
          {{ remaining }}
        </div>
      </template>
      <template #tip>Remaining cards</template>
    </Tip>

    <Tip>
      <template #btn>
        <div  class="info" title="Played cards">
          <fa icon="book-dead" fixed-width size="lg"/>
          {{ played }}
        </div>
      </template>
      <template #tip>Played cards</template>
    </Tip>

    <Tip v-if="remainingPhenomena !== null">
      <template #btn>
        <div class="info" title="Remaining phenomena">
          <fal fixed-width>
            <fa icon="layer-group" size="lg" />
            <fa icon="fire-alt" transform="shrink-2 right-5 down-4" :style="{ color: 'red' }" />
          </fal>
          <span>{{ remainingPhenomena }}</span>
        </div>
      </template>
      <template #tip>Remaining phenomena</template>
    </Tip>

    <Tip v-if="playedPhenomena !== null">
      <template #btn>
        <div class="info" title="Played phenomena">
          <fal fixed-width>
            <fa icon="book-dead" size="lg" />
            <fa icon="fire-alt" transform="shrink-2 right-5 down-4" :style="{ color: 'red' }" />
          </fal>
          <span>{{ playedPhenomena }}</span>
        </div>
      </template>
      <template #tip>Played phenomena</template>
    </Tip>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-facing-decorator';
import Tip from './Tip.vue';
import { DualDeck } from '#/model/map/eternities';
import { useMain } from '#/store/main';


@Component({ components: { Tip } })
export default class DeckStatus extends Vue {
  private store = useMain();

  public get remaining(): number {
    return this.store.map.remaining;
  }

  public get played(): number {
    return this.store.map.played.length;
  }

  public get remainingPhenomena(): number | null {
    return this.store.map instanceof DualDeck
      ? this.store.map.remainingPhenomena
      : null;
  }

  public get playedPhenomena(): number | null {
    return this.store.map instanceof DualDeck
      ? this.store.map.playedPhenomena.length
      : null;
  }
}
</script>

<style lang="scss" scoped>
.status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;
    padding: calc(0.5em - 1px) 1em;
  }
}
</style>
