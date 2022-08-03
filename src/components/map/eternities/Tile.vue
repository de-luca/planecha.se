<template>
  <component
    v-if="tileComponent"
    class="tile"
    :is="tileComponent"
    :tile="tile"
    :hidden="hidden"
    @hellride="hellride"
    @show="show"
  />
  <div v-else></div>
</template>

<script lang="ts">
import { Component } from 'vue';
import { Options, prop, Vue } from 'vue-class-component';

import Current from './tile/Current.vue';
import Hellrideable from './tile/Hellrideable.vue';
import Planewalkable from './tile/Planewalkable.vue';
import Unreachable from './tile/Unreachable.vue';
import { Tile as TileModel } from '@/model/map/eternities';

class Props {
  public tile = prop<TileModel>({ required: false });
  public x = prop<number>({ required: true });
  public y = prop<number>({ required: true });
  public hidden = prop<boolean>({ required: true });
}

@Options({
  emits: [ 'show', 'hellride' ],
  components: {
    Current,
    Hellrideable,
    Planewalkable,
    Unreachable,
  },
})
export default class Tile extends Vue.with(Props) {
  public get tileComponent(): Component | undefined {
    if (this.tile) {
      if (Math.abs(this.x) + Math.abs(this.y) === 0) {
        return Current;
      }

      if (Math.abs(this.x) + Math.abs(this.y) === 1) {
        return Planewalkable;
      }

      if (!this.hidden) {
        return Unreachable;
      }
    }

    if (
      !this.hidden
      && !this.tile
      && Math.abs(this.x) + Math.abs(this.y) === 2
      && Math.abs(this.x) === 1
      && Math.abs(this.y) === 1
    ) {
      return Hellrideable;
    }

    return undefined;
  }

  public hellride(): void {
    const coords: Coordinates = { x: this.x, y: this.y };
    this.$emit('hellride', coords);
  }

  public show(): void {
    this.$emit('show', this.tile);
  }
}
</script>

<style lang="scss" scoped>
.tile:hover {
  cursor: pointer;
}
</style>

