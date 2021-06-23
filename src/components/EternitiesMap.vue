<template>
  <div class="map">
    <template v-for="y in 7" :key="y">
      <tile
        v-for="x in 7"
        :key="x"
        :tile="getTile(x, y)"
        :x="x - off"
        :y="y - off"
      />
    </template>

    <chaos-btn class="chaos" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Store, useStore } from '@/store';
import { Tile as TileModel } from '@/model/map/MapInterface';
import ChaosBtn from '@/components/ChaosBtn.vue';
import Tile from '@/components/eternities/Tile.vue';

@Options({
  components: { Tile, ChaosBtn },
})
export default class EternitiesMap extends Vue {
  private readonly off = 4;
  private store: Store;

  public created(): void {
    this.store = useStore();

    console.log(this.store.getters.tiles);
  }

  public unreachable(x: number, y: number): boolean {
    return Math.abs(x - this.off) + Math.abs(y - this.off) > 3;
  }

  public getTile(x: number, y: number): TileModel | undefined {
    return this.store.getters.tiles.find((tile) => {
      return tile.coordinates.x === x - this.off
        && tile.coordinates.y === y - this.off;
    });
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
