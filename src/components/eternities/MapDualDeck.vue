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

    <phenomenon-wall
      v-if="encounteringPhenomenon"
      :phenomenon="encounteringPhenomenon"
      :resolver="revealer?.seeder"
      :disabled="revealer && revealer.passive"
    />

    <encounter-wall
      v-if="encounterWallConfig"
      :config="encounterWallConfig"
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
  </div>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import {
  Coordinates,
  EncounterTrigger,
  EncounterTriggers,
  TriggerConfig,
} from '@/model/map';
import { ActionTypes } from '@/store';
import { EternitiesMap } from '@/components/eternities/EternitiesMap';
import ChaosBtn from '@/components/ChaosBtn.vue';
import Tile from '@/components/eternities/Tile.vue';
import
  EncounterWall,
  { EncounterWallConfig }
from '@/components/eternities/EncounterWall.vue';
import PhenomenonWall from '@/components/eternities/PhenomenonWall.vue';
import Scry from '@/components/reveal/Scry.vue';
import Pick from '@/components/reveal/Pick.vue';
import Show from '@/components/reveal/Show.vue';

@Options({
  components: {
    Tile, ChaosBtn,
    PhenomenonWall, EncounterWall,
    Scry, Pick, Show,
  },
})
export default class EternitiesMapDualDeck extends mixins(EternitiesMap) {
  private triggers: EncounterTriggers;
  private encounterWallConfig: EncounterWallConfig | null = null;

  public created(): void {
    this.setUp();
    this.triggers = this.store.getters.map.encounterTriggers;
  }

  public preHellride(coordinates: Coordinates): void {
    console.log('HELLRIDE', coordinates);
    console.log(this.getTriggerConfig(EncounterTrigger.ON_HELLRIDE) ??
      this.getTriggerConfig(EncounterTrigger.ON_PLANESWALK));
    this.handleTrigger(
      coordinates,
      this.getTriggerConfig(EncounterTrigger.ON_HELLRIDE) ??
      this.getTriggerConfig(EncounterTrigger.ON_PLANESWALK),
    );
  }

  public prePlaneswalk(coordinates: Coordinates): void {
    console.log('PLANESWALK', coordinates);
    console.log(this.getTriggerConfig(EncounterTrigger.ON_PLANESWALK),);
    this.handleTrigger(
      coordinates,
      this.getTriggerConfig(EncounterTrigger.ON_PLANESWALK),
    );
  }

  public planeswalk(coordinates: Coordinates): void {
    this.encounterWallConfig = null;
    this.store.dispatch(ActionTypes.PLANESWALK, { coordinates });
  }

  public encounter(coordinates: Coordinates): void {
    this.encounterWallConfig = null;
    this.store.dispatch(ActionTypes.ENCOUNTER, { coordinates });
  }

  private getTriggerConfig(
    trigger: EncounterTrigger,
  ): TriggerConfig | undefined {
    return this.triggers[trigger].enabled
      ? this.triggers[trigger]
      : undefined;
  }

  private handleTrigger(
    coordinates: Coordinates,
    trigger: TriggerConfig | undefined,
  ): void {
    if (trigger) {
      this.encounterWallConfig = {
        coordinates,
        triggerConfig: trigger,
      };
    } else {
      this.planeswalk(coordinates);
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
