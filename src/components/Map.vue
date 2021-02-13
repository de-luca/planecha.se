<template>
  <div class="map">
    <Plane
      v-for="plane in hellridingPlanes"
      :key="plane.x + ',' + plane.y"
      :name="plane.x + ',' + plane.y"
      :style="{
        'grid-column': plane.x + 4,
        'grid-row': plane.y + 4,
      }"
    />

    <Plane
      v-for="plane in planes"
      :key="plane.x + ',' + plane.y"
      :name="plane.name"
      :style="{
        'grid-column': plane.x + 4,
        'grid-row': plane.y + 4,
      }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Plane from './Plane.vue';

const PLANES = [
  {
    name: 'Plane 1',
    x: 0,
    y: 0,
  },
  {
    name: 'Plane 2',
    x: -1,
    y: 0,
  },
  {
    name: 'Plane 3',
    x: 1,
    y: 0,
  },
  {
    name: 'Plane 4',
    x: 0,
    y: -1,
  },
  {
    name: 'Plane 5',
    x: 0,
    y: 1,
  },
  {
    name: 'Plane 6',
    x: 1,
    y: 1,
  },
];

const data = {
  planes: PLANES,
};

export default defineComponent({
  name: 'Map',
  components: {
    Plane,
  },

  // props: {
  //   planes: {
  //     type: Array,
  //     default: () => [],
  //   },
  // },
  data() {
    return data;
  },

  computed: {
    hellridingPlanes() {
      return true;
      // const hellridingPlanes = [];
      // const hellridingCoord = [-1, 1];
      // for (const x of hellridingCoord) {
      //   for (const y of hellridingCoord) {
      //     if (!this.planes.find((plane) => plane.x === x && plane.y === y)) {
      //       hellridingPlanes.push({ x, y });
      //     }
      //   }
      // }
      // return hellridingPlanes;
    },
  },
});
</script>

<style lang="sass" scoped>
.map
 background-color: yellow
 display: grid
 grid-template-columns: repeat(7, 100px)
 grid-gap: 1em
 grid-auto-rows: repeat(7, 50px)
</style>
