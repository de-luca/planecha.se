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
        @start="start"
        @planeswalk="prePlaneswalk"
        @hellride="preHellride"
      />
    </template>

    <chaos-btn class="chaos" />
  </div>

  <feed :defaultShow="false" />

  <phenomenon-wall
    v-if="phenomenonWall"
    :config="phenomenonWall.config"
    :phenomenon="phenomenonWall.phenomenon"
    :resolver="revealer?.seeder"
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
import { ActionTypes } from '@/store';
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
} from '@/model/states';
import { WallConfig } from '../Wall';

import ChaosBtn from '@/components/ChaosBtn.vue';
import Tile from '@/components/eternities/Tile.vue';
import PhenomenonWall from '@/components/wall/PhenomenonWall.vue';
import EncounterWall from '@/components/wall/EncounterWall.vue';
import Scry from '@/components/reveal/Scry.vue';
import Pick from '@/components/reveal/Pick.vue';
import Show from '@/components/reveal/Show.vue';
import Feed from '@/components/board/Feed.vue';


type LocalEncounterWallConfig = {
  config: WallConfig;
  coords: Coordinates;
  triggerConfig: TriggerConfig;
}

@Options({
  components: {
    Tile, ChaosBtn, Feed,
    PhenomenonWall, EncounterWall,
    Scry, Pick, Show,
  },
})
export default class EternitiesMapDualDeck extends mixins(EternitiesMap) {
  private triggers: EncounterTriggers;

  public created(): void {
    this.setUp();
    this.triggers = this.store.getters.map.encounterTriggers;
  }

  public get encounterWallConfig(): LocalEncounterWallConfig | undefined {
    const wall =
      this.store.getters.map.states.get<EncounterWallState>(StateKey.ENCOUNTER_WALL);

    if (!wall) {
      return undefined;
    }

    return {
      ...wall,
      config: {
        passive: wall?.passive ?? false,
        mateName: wall?.initiator
          ? this.store.getters.mates.get(wall.initiator)
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
    this.handleTrigger(
      coords,
      this.getTriggerConfig(EncounterTrigger.ON_PLANESWALK),
    );
  }

  public planeswalk(coords: Coordinates): void {
    this.store.dispatch(ActionTypes.UPDATE_STATE, {
      key: StateKey.ENCOUNTER_WALL,
      op: StateOp.DELETE,
    });
    this.store.dispatch(ActionTypes.PLANESWALK, { coords });
  }

  public encounter(coords: Coordinates): void {
    this.store.dispatch(ActionTypes.UPDATE_STATE, {
      key: StateKey.ENCOUNTER_WALL,
      op: StateOp.DELETE,
    });
    this.store.dispatch(ActionTypes.ENCOUNTER, { coords });
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
        this.store.dispatch(ActionTypes.UPDATE_STATE, {
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

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, auto);
  gap: 1rem;
  align-content: center;
}

.chaos {
  position: absolute;
  top: 0;
  right: 0;
  height: 10rem;
  width: 10rem;
}
</style>
