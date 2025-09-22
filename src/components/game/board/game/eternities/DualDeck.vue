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
import { Tile, TileDetails } from "./controls";

import type {
	DualDeck,
	EncounterTrigger,
	TriggerConfig,
} from "@/model/game/eternities";
import { StateKey, StateOp } from "@/model/wall";
import { useMain } from "@/store";
import type { Coordinates } from "@/types";
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

<!-- <script lang="ts">
import { Component } from "vue-facing-decorator";
import {
	type DualDeck as DualDeckGame,
	EncounterMechanic,
	EncounterTrigger,
	type EncounterTriggers,
	type TriggerConfig,
} from "@/model/game/eternities";
import { StateKey, StateOp } from "@/model/wall";
import { Eternities } from "#board/game/eternities/Eternities";
import type { WallConfig } from "#board/wall/types";

import Tile from "#board/game/eternities/tiles/Tile.vue";
import TileDetails from "#board/game/eternities/tiles/TileDetails.vue";
import EncounterWall from "#board/wall/EncounterWall.vue";
import PhenomenonWall from "#board/wall/PhenomenonWall.vue";

interface LocalEncounterWallConfig {
	config: WallConfig;
	coords: Coordinates;
	triggerConfig: TriggerConfig;
}

@Component({
	components: { Tile, TileDetails, PhenomenonWall, EncounterWall },
})
export default class DualDeck extends Eternities {
	private triggers: EncounterTriggers;

	public created(): void {
		this.triggers = (this.store.game as DualDeckGame).encounterTriggers;
	}

	public get encounterWallConfig(): LocalEncounterWallConfig | undefined {
		const wall = this.store.game.walls.get(StateKey.ENCOUNTER_WALL);

		if (!wall) {
			return undefined;
		}

		return {
			...wall,
			config: {
				mateName: wall.initiator,
			},
		};
	}

	public preHellride(coords: Coordinates): void {
		const config =
			this.getTriggerConfig("onHellride") ??
			this.getTriggerConfig("onPlaneswalk");

		this.handleTrigger(coords, config);
	}

	public prePlaneswalk(coords: Coordinates): void {
		this.hideTileDetails();
		this.handleTrigger(
			coords,
			this.getTriggerConfig("onPlaneswalk"),
		);
	}

	public planeswalk(coords: Coordinates): void {
		this.store.updateWallState({
			key: StateKey.ENCOUNTER_WALL,
			op: StateOp.DELETE,
		});
		this.store.planeswalk({ coords });
	}

	public encounter(coords: Coordinates): void {
		this.store.updateWallState({
			key: StateKey.ENCOUNTER_WALL,
			op: StateOp.DELETE,
		});
		this.store.encounter({ coords });
	}

	private getTriggerConfig(
		trigger: EncounterTrigger,
	): TriggerConfig | undefined {
		return this.triggers[trigger].enabled ? this.triggers[trigger] : undefined;
	}

	private handleTrigger(
		coords: Coordinates,
		trigger: TriggerConfig | undefined,
	): void {
		if (trigger) {
			if (
				trigger.enabled &&
				trigger.mechanic === "auto" &&
				trigger.ratio === 1
			) {
				this.encounter(coords);
			} else {
				this.store.updateWallState({
					key: StateKey.ENCOUNTER_WALL,
					op: StateOp.SET,
					val: {
						coords,
						triggerConfig: trigger,
						initiator: this.store.logName,
					},
				});
			}
		} else {
			this.planeswalk(coords);
		}
	}
}
</script> -->

<!-- <style lang="scss" scoped>
.wrapper {
  height: 100%;
  padding: 1rem;
  display: grid;
  grid-template-rows: repeat(7, 1fr );
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
</style> -->
