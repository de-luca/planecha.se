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
        @hellride="preHellride"
        @show="showTileDetails"
      />
    </template>
  </div>

  <TileDetails
    v-if="displayedTile"
    :tile="displayedTile"
    @close="hideTileDetails"
    @planeswalk="prePlaneswalk"
  />

  <PhenomenonWall
    v-if="phenomenonWallConfig"
    :config="phenomenonWallConfig.config"
    :phenomenon="phenomenonWallConfig.phenomenon"
    @resolve="(phenomenonWallConfig.seeder ?? store.resolve)()"
  />

  <EncounterWall
    v-if="encounterWallConfig"
    :config="encounterWallConfig.config"
    :coords="encounterWallConfig.coords"
    :triggerConfig="encounterWallConfig.triggerConfig"
    @planeswalk="planeswalk"
    @encounter="encounter"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

import { EncounterWall, PhenomenonWall } from "@/components/game/board/wall";
import type {
	DualDeck,
	EncounterTrigger,
	TriggerConfig,
} from "@/model/game/eternities";
import { StateKey, StateOp } from "@/model/wall";
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

const triggers = computed(() => (store.game as DualDeck).encounterTriggers);
const encounterWallConfig = computed(() => {
	const wall = store.game.walls.get(StateKey.ENCOUNTER_WALL);
	return !wall
		? undefined
		: {
				...wall,
				config: { mateName: wall.initiator },
			};
});

const preHellride = (coords: Coordinates) =>
	handleTrigger(
		coords,
		getTriggerConfig("onHellride") ?? getTriggerConfig("onPlaneswalk"),
	);

const prePlaneswalk = (coords: Coordinates) => {
	hideTileDetails();
	handleTrigger(coords, getTriggerConfig("onPlaneswalk"));
};

const planeswalk = (coords: Coordinates) => {
	store.updateWallState({
		key: StateKey.ENCOUNTER_WALL,
		op: StateOp.DELETE,
	});
	store.planeswalk({ coords });
};

const encounter = (coords: Coordinates) => {
	store.updateWallState({
		key: StateKey.ENCOUNTER_WALL,
		op: StateOp.DELETE,
	});
	store.encounter({ coords });
};

const getTriggerConfig = (trigger: EncounterTrigger) =>
	triggers.value[trigger].enabled ? triggers.value[trigger] : undefined;

const handleTrigger = (coords: Coordinates, trigger?: TriggerConfig) => {
	if (trigger) {
		if (trigger.enabled && trigger.mode === "auto" && trigger.ratio === 1) {
			encounter(coords);
		} else {
			store.updateWallState({
				key: StateKey.ENCOUNTER_WALL,
				op: StateOp.SET,
				val: {
					coords,
					triggerConfig: trigger,
					initiator: store.logName,
				},
			});
		}
	} else {
		planeswalk(coords);
	}
};

defineExpose({
	planeswalk,
	customPlaneswalk,
	putBack,
});
</script>
