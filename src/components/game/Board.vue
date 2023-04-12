<template>
  <div class="board">

    <div class="nav">
      <div class="brand">
        <div>⟁</div>
        <div>⟁</div>
        <div>⟁</div>
      </div>

      <div class="spacer"></div>

      <online-controls />
      <dice-tray />
      <main-menu />
    </div>

    <div class="map-container">
      <component :is="mapComponent" />
    </div>

    <notif-center />

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { Component as VueComponent } from '@vue/runtime-core';
import { useMain } from '#/store/main';
import { MapType } from '#/model/map';
import { EternitiesMapSpecs, EternitiesMapSubType } from '#/model/map/eternities';

import Single from '#board/map/single/Single.vue';
import SingleDeck from '#board/map/eternities/SingleDeck.vue';
import DualDeck from '#board/map/eternities/DualDeck.vue';
import NotifCenter from '#board/NotifCenter.vue';
import ThemeSelector from '#/components/controls/ThemeSelector.vue';

import MainMenu from '#board/menu/MainMenu.vue';
import OnlineControls from '#board/menu/OnlineControls.vue';
import DiceTray from '#board/menu/DiceTray.vue';

@Component({
  components: {
    Single, SingleDeck, DualDeck,
    NotifCenter,
    ThemeSelector, MainMenu, OnlineControls,
    DiceTray,
  },
})
export default class Board extends Vue {
  private store = useMain();

  public get mapComponent(): VueComponent {
    const specs = this.store.map.specs;

    switch (specs.type) {
      case MapType.SINGLE:
        return Single;
      case MapType.ETERNITIES:
        return (specs as EternitiesMapSpecs).subType === EternitiesMapSubType.SINGLE_DECK
          ? SingleDeck
          : DualDeck;
      default:
        throw new Error('Incompatible');
    }
  }

  public get online(): boolean {
    return !!this.store.game;
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
  gap: 1rem;
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

.map-container {
  grid-area: map;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  width: 100%;
}

.notif-center {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  width: calc(22rem - .5rem);
}
</style>
