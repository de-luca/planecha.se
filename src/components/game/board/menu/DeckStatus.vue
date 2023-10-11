<template>
  <div class="wrapper">
    <tip>
      <template #btn>
        <div class="info" title="Remaining cards">
          <fa icon="map" fixed-width size="lg" />
          {{ active }}
        </div>
      </template>
      <template #tip>Active cards</template>
    </tip>

    <tip>
      <template #btn>
        <div class="info" title="Remaining cards">
          <fa icon="eye" fixed-width size="lg" />
          {{ revealed }}
        </div>
      </template>
      <template #tip>Revealed cards</template>
    </tip>

    <tip>
      <template #btn>
        <div class="info" title="Remaining cards">
          <fa icon="layer-group" fixed-width size="lg" />
          <div>
            <span>{{ remaining }}</span>
            <span v-if="remainingPhenomena !== null">{{ remainingPhenomena }}</span>
          </div>
        </div>
      </template>
      <template #tip>
        <div class="description">
          <div>Remaining cards</div>
          <div v-if="remainingPhenomena !== null">
            <span>Planes</span>
            <span>Phenomena</span>
          </div>
        </div>
      </template>
    </tip>

    <tip>
      <template #btn>
        <div class="info" title="Played cards">
          <fa icon="book-dead" fixed-width size="lg"/>
          <div>
            <span>{{ played }}</span>
            <span v-if="playedPhenomena !== null">{{ playedPhenomena }}</span>
          </div>
        </div>
      </template>
      <template #tip>
        <div class="description">
          <div>Played cards</div>
          <div v-if="playedPhenomena !== null">
            <span>Planes</span>
            <span>Phenomena</span>
          </div>
        </div>
      </template>
    </tip>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-facing-decorator';
import { DualDeck, EternitiesMap } from '#/model/map/eternities';
import { useMain } from '#/store/main';

@Component
export default class DeckStatus extends Vue {
  private store = useMain();

  public get revealed(): number {
    return (this.store.map.revealed?.others.length ?? 0)
      + (this.store.map.revealed?.relevant.length ?? 0);
  }

  public get active(): number {
    if (this.store.map instanceof EternitiesMap) {
      return this.store.map.tiles
        .reduce((sum, t) => sum + t.plane.length, 0);
    }

    return this.store.map.active.length;
  }

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
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: .5rem;

  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: calc(0.5em - 1px) 1em;

    div:nth-child(2) {
      display: flex;
      flex-direction: row;
      gap: .5rem;

      span:nth-child(2) {
        color: red;
      }
    }
  }

  .description {
    display: flex;
    flex-direction: column;
    align-items: center;

    div:nth-child(2) {
      display: flex;
      flex-direction: row;
      gap: .5rem;

      span:nth-child(2) {
        color: red;
      }
    }
  }
}
</style>
