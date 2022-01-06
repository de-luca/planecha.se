<template>
  <div class="board">

    <div class="nav">
      <div class="brand" @click="thaNav">
        <div title="F">⟁</div>
        <div title="D">⟁</div>
        <div title="F">⟁</div>
      </div>

      <div class="spacer"></div>

      <online-controls v-if="online" />
      <dice-tray />
      <main-menu />
    </div>

    <component :is="mapComponent" />

    <notif-center />

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useMain } from '@/store/main';
import { Component } from '@vue/runtime-core';
import { MapType, EternitiesMapSpecs, EternitiesMapSubType } from '@/model/map';
import { eventBus, EventType } from '@/services/EventBus';

import ClassicMap from '@/components/classic/ClassicMap.vue';
import MapSingleDeck from '@/components/eternities/MapSingleDeck.vue';
import MapDualDeck from '@/components/eternities/MapDualDeck.vue';
import NotifCenter from '@/components/board/NotifCenter.vue';
import ThemeSelector from '@/components/ThemeSelector.vue';

import MainMenu from '@/components/board/MainMenu.vue';
import OnlineControls from '@/components/board/OnlineControls.vue';
import DiceTray from '@/components/board/DiceTray.vue';


@Options({
  components: {
    ClassicMap, MapSingleDeck, MapDualDeck,
    NotifCenter,
    ThemeSelector, MainMenu, OnlineControls,
    DiceTray,
  },
})
export default class Board extends Vue {
  private store = useMain();

  public created() {
    eventBus.on(EventType.BYE, (payload) => {
      eventBus.emit(EventType.NOTIF, {
        text: `<b>${this.store.mates.get(payload.mateId)}</b> has left the game`,
        className: 'is-warning',
      });

      this.store.bye({ id: payload.mateId });
    });
  }

  public get mapComponent(): Component {
    const specs = this.store.map.specs;

    switch (specs.type) {
      case MapType.CLASSIC:
        return ClassicMap;
      case MapType.ETERNITIES:
        return (specs as EternitiesMapSpecs).subType === EternitiesMapSubType.SINGLE_DECK
          ? MapSingleDeck
          : MapDualDeck;
      default:
        throw new Error('Incompatible');
    }
  }

  public get online(): boolean {
    return this.store.online;
  }

  public thaNav(): void {
    console.log('Fucking Dumpster Fire (FDF)');
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
  align-items: center;
  gap: .5rem;
  z-index: 420;

  .spacer {
    flex-grow: 1;
  }

  .brand {
    font-family: arial;
    color: var(--brand-color-primary);

    div {
      position: relative;
      z-index: 1;
      display: inline-block;
      font-size: 2.5rem;
      line-height: 3rem;
      width: 3rem;
      text-align: center;

      &:hover {
        cursor: pointer;
        color: var(--brand-color-secondary);
      }

      &:nth-child(1) {
        transform: rotate(180deg)
      }
      &:nth-child(2) {
        transform: translateX(-1.5rem);
        z-index: 2;
      }
      &:nth-child(3) {
        transform: rotate(180deg) translateX(3rem);
        position: absolute;
      }
    }
  }
}

.map {
  grid-area: map;
  margin-left: auto;
  margin-right: auto;
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
