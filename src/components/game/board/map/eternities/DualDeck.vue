<template>
  <div class="wrapper">
    <template v-for="y in 7" :key="y">
      <tile
        v-for="x in 7"
        :key="x"
        :tile="getTile(x, y)"
        :x="x - off"
        :y="y - off"
        :hidden="!hasStarted"
        @hellride="preHellride"
        @show="showTileDetails"
      />
    </template>
  </div>

  <tile-details
    v-if="displayedTile"
    :tile="displayedTile"
    @close="hideTileDetails"
    @planeswalk="prePlaneswalk"
  />

  <phenomenon-wall
    v-if="phenomenonWallConfig"
    :config="phenomenonWallConfig.config"
    :phenomenon="phenomenonWallConfig.phenomenon"
    @resolve="(phenomenonWallConfig.seeder ?? resolve)()"
  />

  <encounter-wall
    v-if="encounterWallConfig"
    :config="encounterWallConfig.config"
    :coords="encounterWallConfig.coords"
    :triggerConfig="encounterWallConfig.triggerConfig"
    @planeswalk="planeswalk"
    @encounter="encounter"
  />
</template>

<script lang="ts">
import { Component } from 'vue-facing-decorator';
import { Eternities } from '#board/map/eternities/Eternities';
import { WallConfig } from '#board/wall/types';
import {
  EncounterWallState,
  StateKey,
  StateOp,
} from '#/model/wall';
import {
  DualDeck as DualDeckMap,
  EncounterMechanic,
  EncounterTrigger,
  EncounterTriggers,
  TriggerConfig,
} from '#/model/map/eternities';

import Tile from '#board/map/eternities/tiles/Tile.vue';
import TileDetails from '#board/map/eternities/tiles/TileDetails.vue';
import PhenomenonWall from '#board/wall/PhenomenonWall.vue';
import EncounterWall from '#board/wall/EncounterWall.vue';

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
    this.triggers = (this.store.map as DualDeckMap).encounterTriggers;
  }

  public get encounterWallConfig(): LocalEncounterWallConfig | undefined {
    const wall =
      this.store.map.wallStates.get<EncounterWallState>(StateKey.ENCOUNTER_WALL);

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
    const config = this.getTriggerConfig(EncounterTrigger.ON_HELLRIDE)
      ?? this.getTriggerConfig(EncounterTrigger.ON_PLANESWALK);

    this.handleTrigger(coords, config);
  }

  public prePlaneswalk(coords: Coordinates): void {
    this.hideTileDetails();
    this.handleTrigger(
      coords,
      this.getTriggerConfig(EncounterTrigger.ON_PLANESWALK),
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

  private getTriggerConfig(trigger: EncounterTrigger): TriggerConfig | undefined {
    return this.triggers[trigger].enabled
      ? this.triggers[trigger]
      : undefined;
  }

  private handleTrigger(
    coords: Coordinates,
    trigger: TriggerConfig | undefined,
  ): void {
    if (trigger) {
      if (
        trigger.enabled &&
        trigger.mechanic === EncounterMechanic.AUTO &&
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
            initiator: this.store.selfName,
          } as EncounterWallState,
        });
      }
    } else {
      this.planeswalk(coords);
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
