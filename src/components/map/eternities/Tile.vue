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
import { Component as VueComponent } from 'vue';
import { Component, Prop, Vue } from 'vue-facing-decorator';

import Current from './tile/Current.vue';
import Hellrideable from './tile/Hellrideable.vue';
import Planewalkable from './tile/Planewalkable.vue';
import Unreachable from './tile/Unreachable.vue';

import { Tile as TileModel } from '@/model/map/eternities';

@Component({
  emits: [ 'show', 'hellride' ],
  components: {
    Current,
    Hellrideable,
    Planewalkable,
    Unreachable,
  },
})
export default class Tile extends Vue {
  @Prop({ required: false })
  public tile?: TileModel;
  @Prop({ required: true })
  public x: number;
  @Prop({ required: true })
  public y: number;
  @Prop({ required: true })
  public hidden: boolean;

  public get tileComponent(): VueComponent | undefined {
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

