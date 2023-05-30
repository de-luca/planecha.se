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
        @show="showTileDetails"
      />
    </template>
  </div>

  <tile-details
    v-if="displayedTile"
    :tile="displayedTile"
    @close="hideTileDetails"
    @planeswalk="planeswalk"
  />

  <phenomenon-wall
    v-if="phenomenonWallConfig"
    :config="phenomenonWallConfig.config"
    :phenomenon="phenomenonWallConfig.phenomenon"
    @resolve="(revealer?.seeder ?? resolve)()"
  />

  <component
    v-if="revealer && revealed"
    :is="revealer.component"
    :revealed="revealed"
    :config="revealer.config"
    @done="revealer!.resolver"
  />
</template>

<script lang="ts">
import { Component } from 'vue-facing-decorator';
import { Eternities } from './Eternities';

import Tile from '#board/map/eternities/Tile.vue';
import TileDetails from '#board/map/eternities/TileDetails.vue';
import PhenomenonWall from '#board/wall/PhenomenonWall.vue';
import Pick from '#board/wall/reveal/Pick.vue';
import Show from '#board/wall/reveal/Show.vue';
import Scry from '#board/wall/reveal/Scry.vue';

@Component({
  inheritAttrs: false,
  components: {
    Tile, TileDetails, PhenomenonWall,
    Scry, Pick, Show,
  },
})
export default class EternitiesMapSingleDeck extends Eternities {
  public planeswalk(coords: Coordinates): void {
    this.hideTileDetails();
    this.store.planeswalk({ coords });
  }
}
</script>

<style lang="scss" scoped>
.map {
  height: 100%;
  padding: 1rem;
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
  align-content: center;
}

.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
