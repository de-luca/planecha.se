<template>
  <div class="map">
    <template v-for="y in 7" :key="y">
      <tile
        v-for="x in 7"
        :key="x"
        :tile="getTile(x, y)"
        :x="x - off"
        :y="y - off"
        :hidden="!hasStarted"
        @hellride="planeswalk"
        @show="showTile"
      />
    </template>

    <chaos-btn
      v-if="hasStarted"
      class="chaos"
    />
    <start-btn
      v-else
      class="start"
      @start="start"
    />
  </div>

  <feed :defaultShow="false" />

  <plane-display
    v-if="shownTile"
    :tile="shownTile"
    @close="closeTile"
    @planeswalk="planeswalk"
  />

  <phenomenon-wall
    v-if="phenomenonWall"
    :config="phenomenonWall.config"
    :phenomenon="phenomenonWall.phenomenon"
    :resolver="revealer?.seeder"
  />

  <component
    v-if="revealer && revealed"
    :is="revealer.component"
    :revealed="revealed"
    :config="revealer.config"
    @done="revealer.resolver"
  />
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import { EternitiesMap } from '@/components/eternities/EternitiesMap';

import ChaosBtn from '@/components/btn/ChaosBtn.vue';
import StartBtn from '@/components/btn/StartBtn.vue';
import Tile from '@/components/eternities/Tile.vue';
import Scry from '@/components/reveal/Scry.vue';
import Pick from '@/components/reveal/Pick.vue';
import Show from '@/components/reveal/Show.vue';
import Feed from '@/components/board/Feed.vue';
import PhenomenonWall from '@/components/wall/PhenomenonWall.vue';
import PlaneDisplay from '@/components/eternities/PlaneDisplay.vue';

@Options({
  inheritAttrs: false,
  components: {
    Tile, ChaosBtn, StartBtn, PhenomenonWall,
    Scry, Pick, Show,
    Feed,
    PlaneDisplay,
  },
})
export default class EternitiesMapSingleDeck extends mixins(EternitiesMap) {
  public created(): void {
    this.setUp();
  }
}
</script>

<style lang="scss" scoped>
.map {
  position: relative;

  @media (max-aspect-ratio: 85/61) {
    & {
      grid-template-columns: repeat(7, calc(  (100vw - 5rem)  / 7) );
    }
  }
  @media (min-aspect-ratio: 85/61) {
    & {
      grid-template-columns: repeat(7, calc( ( (100vw - 5rem) / (85 / 61) ) / 7) );
    }
  }

  display: grid;

  grid-template-rows: repeat(7, calc(((100vh - 6.5rem) - (6 * .5rem)) / 7));
  gap: .5rem;
  align-content: center;

  .tile {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.chaos, .start {
  position: absolute;
  top: 0;
  right: 0;
  height: 10rem;
  width: 10rem;
}
</style>
