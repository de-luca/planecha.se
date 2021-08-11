<template>
  <div class="board">

    <div class="nav">
      <div class="brand" @click="thaNav">
        <div>⟁</div>
        <div>⟁</div>
        <div>⟁</div>
      </div>
      <online-controls v-if="online"/>
      <close-game />
    </div>

    <component class="map" :is="mapComponent" />

    <notif-center />

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { MutationTypes, Store, useStore } from '@/store';
import ClassicMap from '@/components/ClassicMap.vue';
import EternitiesMap from '@/components/EternitiesMap.vue';
import OnlineControls from '@/components/board/OnlineControls.vue';
import NotifCenter from '@/components/board/NotifCenter.vue';
import CloseGame from '@/components/board/CloseGame.vue';
import { Component } from '@vue/runtime-core';
import { MapType } from '@/model/map/MapInterface';
import { eventBus, EventType } from '@/services/EventBus';


@Options({
  components: {
    ClassicMap, EternitiesMap,
    OnlineControls, NotifCenter, CloseGame,
  },
})
export default class Board extends Vue {
  public store: Store;

  public created() {
    this.store = useStore();

    eventBus.on(EventType.BYE, (payload) => {
      eventBus.emit(EventType.NOTIF, {
        text: `<b>${this.store.getters.mates.get(payload.mateId)}</b> has left the game`,
        className: 'is-warning',
      });

      this.store.commit(MutationTypes.BYE, { id: payload.mateId });
    });
  }

  public get mapComponent(): Component {
    switch (this.store.getters.specs.type) {
      case MapType.CLASSIC:
        return ClassicMap;
      case MapType.ETERNITIES:
        return EternitiesMap;
      default:
        throw new Error('Incompatible');
    }
  }

  public get online(): boolean {
    return this.store.getters.online;
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
  gap: 1.5rem;
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
  gap: .5rem;

  .brand {
    flex-grow: 1;

    div {
      display: inline-block;
      font-size: 2em;
      width: 3rem;
      text-align: center;

      &:hover {
        cursor: pointer;
        color: gray;
      }

      &:nth-child(1) {
        transform: rotate(180deg)
      }
      &:nth-child(2) {
        transform: translateX(-1.5rem);
      }
      &:nth-child(3) {
        transform: rotate(180deg) translateX(3rem);
      }
    }
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
  width: 100%;
}

.notif-center {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 30rem;
}
</style>
