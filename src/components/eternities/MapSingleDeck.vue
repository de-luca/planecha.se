<template>
  <div class="map-wrapper">
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
          @show="showTileDetails"
        />
      </template>
    </div>
  </div>

  <div class="controls">
    <component :is="btnComponent" />
  </div>

  <div class="feed">
    <feed :defaultShow="false" />
  </div>

  <tile-details
    v-if="displayedTile"
    :tile="displayedTile"
    @close="hideTileDetails"
    @planeswalk="planeswalk"
  />

  <phenomenon-wall
    v-if="phenomenonWall"
    :config="phenomenonWall.config"
    :phenomenon="phenomenonWall.phenomenon"
    @resolve="(revealer?.seeder ?? resolve)()"
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
import TileDetails from '@/components/eternities/TileDetails.vue';
import Feed from '@/components/board/Feed.vue';
import PhenomenonWall from '@/components/wall/PhenomenonWall.vue';
import Pick from '@/components/wall/reveal/Pick.vue';
import Scry from '@/components/wall/reveal/Scry.vue';
import Show from '@/components/wall/reveal/Show.vue';

@Options({
  inheritAttrs: false,
  components: {
    ChaosBtn, StartBtn,
    Tile, TileDetails, PhenomenonWall,
    Scry, Pick, Show,
    Feed,
  },
})
export default class EternitiesMapSingleDeck extends mixins(EternitiesMap) {
  public created(): void {
    this.setUp();
  }

  public planeswalk(coords: Coordinates): void {
    console.log(coords);
    this.hideTileDetails();
    this.store.planeswalk({ coords });
  }
}
</script>

<style lang="scss" scoped>
.map-wrapper {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.map {
  @media (min-aspect-ratio: 85/61) {
    & {
      grid-template-columns: repeat(7, calc( (((100vw - 2rem) - (6 * 1rem)) / (85 / 61)) / 7) );
    }
  }

  @media (max-aspect-ratio: 1/1) {
    & {
      grid-template-rows: repeat(7, calc( (((100vw - 6rem) - (6 * 1rem)) / (85 / 61)) / 7) );
    }
  }

  position: relative;
  display: grid;
  grid-template-rows: repeat(7, calc( ((100vh - 6rem) - (6 * 1rem)) / 7) );
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
  align-content: center;

  .tile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.controls {
  position: absolute;
  top: 0;
  right: 0;

  width: 22rem;
  height: 8rem;

  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;

  button {
    height: 6rem;
    width: 6rem;
  }
}

.feed {
  position: absolute;
  bottom: 0;
  right: 0;

  width: 22rem;
}
</style>
