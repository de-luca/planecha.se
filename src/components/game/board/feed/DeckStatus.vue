<template>
  <div class="status">
    <div title="Remaining cards">
      <fa icon="layer-group" fixed-width />
      <span>{{ remaining }}</span>
    </div>

    <div title="Played cards">
      <fa icon="book-dead" fixed-width />
      <span>{{ played }}</span>
    </div>

    <div v-if="remainingPhenomena !== null" title="Remaining phenomena">
      <fal fixed-width>
        <fa icon="layer-group" />
        <fa icon="fire-alt" transform="shrink-2 right-5 down-4" :style="{ color: 'red' }" />
      </fal>
      <span>{{ remainingPhenomena }}</span>
    </div>

    <div v-if="playedPhenomena !== null" title="Played phenomena">
      <fal fixed-width>
        <fa icon="book-dead" />
        <fa icon="fire-alt" transform="shrink-2 right-5 down-4" :style="{ color: 'red' }" />
      </fal>
      <span>{{ playedPhenomena }}</span>
    </div>

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-facing-decorator';
import { DualDeck } from '#/model/map/eternities';
import { useMain } from '#/store/main';

@Component
export default class DeckStatus extends Vue {
  private store = useMain();

  public get remaining(): number {
    return this.store.map.remaining;
  }

  public get played(): number {
    return this.store.map.played.length;
  }

  public get remainingPhenomena(): number | null {
    if (this.store.map instanceof DualDeck) {
      return this.store.map.remainingPhenomena;
    }

    return null;
  }

  public get playedPhenomena(): number | null {
    if (this.store.map instanceof DualDeck) {
      return this.store.map.playedPhenomena.length;
    }

    return null;
  }
}
</script>

<style lang="scss" scoped>
.status {
  flex-grow: 1;

  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  border-style: solid;
  border-width: 1px;

  span {
    width: 2rem;
    text-align: center;
    display: inline-block;
  }
}
</style>
