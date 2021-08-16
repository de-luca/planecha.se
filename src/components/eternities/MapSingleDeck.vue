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
        @planeswalk="planeswalk"
        @hellride="planeswalk"
      />
    </template>

    <chaos-btn class="chaos" />

    <phenomenon
      v-if="encounteringPhenomenon"
      :phenomenon="encounteringPhenomenon"
      :resolver="revealer?.seeder"
      :disabled="revealer && revealer.passive"
    ></phenomenon>

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
import { EternitiesMap } from '@/components/eternities/EternitiesMap';
import ChaosBtn from '@/components/ChaosBtn.vue';
import Tile from '@/components/eternities/Tile.vue';
import Phenomenon from '@/components/eternities/PhenomenonWall.vue';
import Scry from '@/components/reveal/Scry.vue';
import Pick from '@/components/reveal/Pick.vue';
import Show from '@/components/reveal/Show.vue';

@Options({
  components: {
    Tile, ChaosBtn, Phenomenon,
    Scry, Pick, Show,
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
