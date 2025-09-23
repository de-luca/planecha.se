<template>
  <div class="h-full grid grid-rows-7 grid-cols-7 gap-[1rem]">
    <template v-for="y in 7" :key="y">
      <Tile
        v-for="x in 7"
        class="flex flex-col justify-center items-center"
        :key="x"
        :tile="getTile(x, y)"
        :x="x - OFF"
        :y="y - OFF"
        :hidden="!hasStarted"
        @hellride="planeswalk"
        @show="showTileDetails"
      />
    </template>
  </div>

  <TileDetails
    :tile="displayedTile"
    @close="hideTileDetails"
    @planeswalk="planeswalk"
  />

  <PhenomenonWall
    v-if="phenomenonWallConfig"
    :config="phenomenonWallConfig.config"
    :phenomenon="phenomenonWallConfig.phenomenon"
    @resolve="(phenomenonWallConfig.seeder ?? store.resolve)()"
  />
</template>

<script setup lang="ts">
import { PhenomenonWall } from "@/components/game/board/wall";
import { useMain } from "@/store";
import type { Coordinates } from "@/types";
import { Tile, TileDetails } from "./controls";
import { useEternities } from "./Eternities";

const store = useMain();
const {
	OFF,
	hasStarted,
	displayedTile,
	phenomenonWallConfig,
	getTile,
	showTileDetails,
	hideTileDetails,
	customPlaneswalk,
	putBack,
} = useEternities();

const planeswalk = (coords: Coordinates) => {
	hideTileDetails();
	store.planeswalk({ coords });
};

defineExpose({
	planeswalk,
	customPlaneswalk,
	putBack,
});
</script>

<!-- <script lang="ts">
import { Component } from "vue-facing-decorator";
import { Eternities } from "./Eternities";

import Tile from "#board/game/eternities/tiles/Tile.vue";
import TileDetails from "#board/game/eternities/tiles/TileDetails.vue";
import PhenomenonWall from "#board/wall/PhenomenonWall.vue";

@Component({
	inheritAttrs: false,
	components: { Tile, TileDetails, PhenomenonWall },
})
export default class EternitiesMapSingleDeck extends Eternities {
	public planeswalk(coords: Coordinates): void {
		this.hideTileDetails();
		this.store.planeswalk({ coords });
	}
}
</script> -->

