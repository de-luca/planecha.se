<template>
  <div class="modal tile-display">
    <div class="modal-background" title="Close" @click="$emit('close')"></div>
    <div class="modal-content">
      <div class="wrapper">
        <card v-for="card in tile.plane" :key="card.id" :card="card" :ro="!current" />
        <button
          v-if="(Math.abs(tile.coords.x) + Math.abs(tile.coords.y) === 1)"
          class="button is-ghost planeswalk-btn"
          title="Planeswalk"
          @click="$emit('planeswalk', { ...tile.coords })"
        >
          <Planeswalk class="icn is-primary" />
        </button>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" title="Close" @click="$emit('close')"></button>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-facing-decorator';
import { Imgable } from '#/components/Imgable';
import { useMain } from '#/store/main';
import { Plane } from '#/model/card';
import { Tile } from '#/model/map/eternities';

import Card from '#/components/controls/Card.vue';
import { Planeswalk } from '#/components/svgs';

@Component({
  emits: [ 'close', 'planeswalk' ],
  components: { Planeswalk, Card },
})
export default class TileDetails extends Imgable {
  @Prop({ required: true })
  public tile: Tile;

  private store = useMain();

  public get current(): boolean {
    return this.tile.coords.x === 0 && this.tile.coords.y === 0;
  }

  public get hasStarted(): boolean {
    return this.store.map.hasStarted;
  }

  public update(plane: Plane, change: number): void {
    this.store.updateCounters({ planeId: plane.id, change });
  }

  public imgSrc(plane: Plane): string {
    return this.buildImgSrc(plane);
  }
}
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  flex-direction: row;
  overflow-y: scroll;

  .modal-background {
    cursor: pointer;
  }

  .modal-content {
    overflow-y: inherit;

    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2.5rem;
      padding: 2.5rem 1rem;

      .planeswalk-btn {
        height: 6rem;
      }
    }
  }
}
</style>
