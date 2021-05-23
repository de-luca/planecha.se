<template>
  <div class="board">
    <div>
      <i class="fad fa-fw fa-4x fa-toilet-paper"></i>
      <button class="button is-ghost">Close Game</button>
    </div>

    <div class="sub-container">
      <component :is="mapComponent" />
    </div>

    <div>
      Whatever status
    </div>
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
    }
  }
}
</script>

<style lang="scss" scoped>
.board {
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: 8rem auto;
  gap: 25px;
}

.sub-container {
  width: 1200px;
  padding-top: 2rem;

  display: grid;
  grid-template-columns: 70% auto;
  gap: 10px;
  grid-template-areas:
    "current deck"
    "current played"
    "current controls"
  ;
}

.current {
  grid-area: current;
}

.deck {
  grid-area: deck;
}

.played {
  grid-area: played;
}

.controls {
  grid-area: controls;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .action {
    display: inline-flex;
    gap: .5rem;
    padding-bottom: 7px;

    button {
      flex: 1 1 0px;
      height: 6rem;

      &:hover {
        svg path {
          filter: drop-shadow(0px 0px 1px #222);
        }
      }

      svg path {
        fill: gray;
      }
      
      .chaos {
        height: 3.5rem;
      }
      .planeswalk {
        height: 6rem;
      }
    }
  }
}
</style>
