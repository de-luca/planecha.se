<template>
  <div class="unreachable" @click="$emit('show')">
    <card v-if="tile.plane.length === 1" :card="tile.plane[0]" />
    <fa v-else :title="tile.plane.length + 'planes'" icon="ellipsis" size="2xl" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';

import Card from '../Card.vue';
import { Tile } from '#/model/map/eternities';

@Component({
  emits: [ 'show' ],
  components: { Card },
})
export default class Unreachable extends Vue {
  @Prop({ required: false })
  public tile: Tile;
  @Prop({ required: true })
  public hidden: boolean;
}
</script>

<style lang="scss" scoped>
.unreachable {
  filter: grayscale(90%);
}

.multi {
  width: 100%;
  position: relative;

  div:first-of-type {
    position: absolute;
    top: -.5rem;
    left: -1rem;
  }

  div:last-of-type {
    position: absolute;
    bottom: -.5rem;
    right: -1rem;
  }
}
</style>
