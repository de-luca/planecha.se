<template>
  <div class="modal tile-display">
    <div class="modal-background" title="Close" @click="$emit('close')"></div>
    <div class="modal-content">
      <div :class="{ 'multi': tile.plane.length > 1 }">
        <div
          class="wrapper"
          v-for="plane in tile.plane"
          :key="plane.id"
        >
          <div
            v-if="plane.counter !== undefined && current && hasStarted"
            class="counters active tags has-addons"
          >
            <span class="tag is-light is-large minus" @click.stop="update(plane, -1)">-</span>
            <span class="tag is-light is-large value">{{ plane.counter.value }}</span>
            <span class="tag is-light is-large plus" @click.stop="update(plane, 1)">+</span>
          </div>

          <div
            v-if="plane.counter !== undefined && (!current || !hasStarted)"
            class="counters inactive tag is-large is-light"
          >
            {{ plane.counter.value }}
          </div>
          <img :src="imgSrc(plane)">
        </div>
      </div>
      <planeswalk-btn
        v-if="(Math.abs(tile.coords.x) + Math.abs(tile.coords.y) === 1)"
        @click="$emit('planeswalk', { ...tile.coords })"
      />
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      title="Close"
      @click="$emit('close')"
    ></button>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-facing-decorator';
import { Imgable } from '#/components/Imgable';
import { useMain } from '#/store/main';
import { Plane } from '#/model/card';
import { Tile } from '#/model/map/eternities';

import PlaneswalkBtn from '#/components/controls/PlaneswalkBtn.vue';

@Component({
  emits: [ 'close', 'planeswalk' ],
  components: { PlaneswalkBtn },
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

  .modal-background {
    cursor: pointer;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    width: 800px;

    overflow: visible;

    img {
      border-radius: 3.5% / 4.7%;
    }

    .multi {
      position: relative;
      width: 800px;
      height: calc(800px / (85 / 61));
      overflow: visible;

      .wrapper {
        position: absolute;

        img{
          position: relative;

          &:hover {
            z-index: 2;
          }
        }

        &:first-child {
          right: 150px;
          bottom: 100px;
        }

        &:last-child {
          left: 150px;
          top: 100px;
        }
      }
    }
  }
}

.counters {
  position: absolute;
  z-index: 2;

  &.active {
    top: calc(-40px - .5rem);
    right: 0;

    .tag {
      &.minus, &.plus {
        cursor: pointer;
        width: 3rem;
      }

      &.value {
        width: 4rem;
      }
    }
  }

  &.inactive {
    width: 4rem;
    right: 0;
    top: calc(-40px - .5rem);
  }
}
</style>
