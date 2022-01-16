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
        @hellride="preHellride"
        @show="showTileDetails"
      />
    </template>

    <div class="controls">
      <component :is="btnComponent" />
    </div>

    <feed class="feed" :defaultShow="false" />
  </div>

  <tile-details
    v-if="displayedTile"
    :tile="displayedTile"
    @close="hideTileDetails"
    @planeswalk="prePlaneswalk"
  />

  <phenomenon-wall
    v-if="phenomenonWall"
    :config="phenomenonWall.config"
    :phenomenon="phenomenonWall.phenomenon"
    @resolve="(revealer?.seeder ?? resolve)()"
  />

  <encounter-wall
    v-if="encounterWallConfig"
    :config="encounterWallConfig.config"
    :coords="encounterWallConfig.coords"
    :triggerConfig="encounterWallConfig.triggerConfig"
    @planeswalk="planeswalk"
    @encounter="encounter"
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
import {
  EncounterMechanic,
  EncounterTrigger,
  EncounterTriggers,
  TriggerConfig,
} from '@/model/map';
import {
  EncounterWallState,
  StateKey,
  StateOp,
} from '@/model/wall';
import { WallConfig } from '../wall/Wall';

import ChaosBtn from '@/components/btn/ChaosBtn.vue';
import StartBtn from '@/components/btn/StartBtn.vue';
import Tile from '@/components/eternities/Tile.vue';
import TileDetails from '@/components/eternities/TileDetails.vue';
import Feed from '@/components/board/Feed.vue';
import PhenomenonWall from '@/components/wall/PhenomenonWall.vue';
import EncounterWall from '@/components/wall/EncounterWall.vue';
import Pick from '@/components/wall/reveal/Pick.vue';
import Scry from '@/components/wall/reveal/Scry.vue';
import Show from '@/components/wall/reveal/Show.vue';


interface LocalEncounterWallConfig {
  config: WallConfig;
  coords: Coordinates;
  triggerConfig: TriggerConfig;
}

@Options({
  components: {
    Tile, ChaosBtn, StartBtn, Feed,
    PhenomenonWall, EncounterWall,
    Scry, Pick, Show,
    TileDetails,
  },
})
export default class EternitiesMapDualDeck extends mixins(EternitiesMap) {
  private triggers: EncounterTriggers;

  public created(): void {
    this.setUp();
    this.triggers = this.store.map.encounterTriggers;
  }

  public get encounterWallConfig(): LocalEncounterWallConfig | undefined {
    const wall =
      this.store.map.walls.get<EncounterWallState>(StateKey.ENCOUNTER_WALL);

    if (!wall) {
      return undefined;
    }

    return {
      ...wall,
      config: {
        mateName: wall?.initiator
          ? this.store.mates.get(wall.initiator)
          : undefined,
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
    this.store.updateState({
      key: StateKey.ENCOUNTER_WALL,
      op: StateOp.DELETE,
    });
    this.store.planeswalk({ coords });
  }

  public encounter(coords: Coordinates): void {
    this.store.updateState({
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
        trigger.mechanic === EncounterMechanic.AUTO &&
        trigger.ratio === 1
      ) {
        this.encounter(coords);
      } else {
        this.store.updateState({
          key: StateKey.ENCOUNTER_WALL,
          op: StateOp.SET,
          val: {
            coords,
            triggerConfig: trigger,
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
.map {
  position: relative;

  @media (max-aspect-ratio: 85/61) {
    & {
      grid-template-columns: repeat(7, calc( ((100vw - 2rem) - (6 * 1rem)) / 7) );
    }
  }
  @media (min-aspect-ratio: 85/61) {
    & {
      grid-template-columns: repeat(7, calc( (((100vw - 2rem) - (6 * 1rem)) / (85 / 61)) / 7) );
    }
  }

  display: grid;
  grid-template-rows: repeat(7, calc( ((100vh - 6.5rem) - (6 * 1rem)) / 7) );
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
  height: 50vh;
}
</style>
