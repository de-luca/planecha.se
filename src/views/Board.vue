<template>
  <div class="board">
    <div class="nav">
      <span @click="thaNav">
        The super logo here
      </span>
      <button class="button is-light is-warning" @click="close">
        Close Game
      </button>
    </div>

    <component class="map" :is="mapComponent" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Store, useStore } from '@/store';
import ClassicMap from '@/components/ClassicMap.vue';
import EternitiesMap from '@/components/EternitiesMap.vue';
import { Component } from '@vue/runtime-core';
import { MapType } from '@/model/map/MapInterface';

@Options({
  components: { ClassicMap, EternitiesMap },
})
export default class Board extends Vue {
  public store: Store;

  public created() {
    this.store = useStore();
  }

  public get mapComponent(): Component {
    switch (this.store.getters.type) {
      case MapType.CLASSIC:
        return ClassicMap;
      case MapType.ETERNITIES:
        return EternitiesMap;
      default:
        throw new Error('Incompatible');
    }
  }

  public close(): void {
    console.log(confirm('Nuke the game?'));
  }

  public thaNav(): void {
    console.log('Fucking dumpster fire');
  }
}
</script>

<style lang="scss" scoped>
.board {
  height: 100%;

  padding: 1rem;

  overflow: hidden;

  display: grid;
  grid-template-rows: 3rem 1fr;
  gap: .5rem;
  grid-template-areas:
    "nav"
    "map"
  ;
}

.nav {
  grid-area: nav;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  span:hover {
    i {
      --fa-primary-color: red;
    }
  }
  
  span i:first-child {
    margin-right: 1rem;
  }
  
  button {
    height: 100%;
  }
}

.map {
  grid-area: map;
  
  margin-left: auto;
  margin-right: auto;

  max-width: 1800px;
  height: 100%;
}
</style>
