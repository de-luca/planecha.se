<template>
  <div class="board">

    <!-- <div id="landscape-guard">
      <h1 class="title">
        Ya might wanna turn that thing sideways, Mate!
      </h1>
      <fa icon="mobile" size="4x" fixed-width spin></fa>
    </div> -->

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

    <div class="map-container">
      <component :is="mapComponent" />
    </div>

    <notif-center />

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { Component as VueComponent } from '@vue/runtime-core';
import { useMain } from '@/store/main';
import { MapType } from '@/model/map';
import { EternitiesMapSpecs, EternitiesMapSubType } from '@/model/map/eternities';

import Classic from '@/components/map/classic/Classic.vue';
import SingleDeck from '@/components/map/eternities/SingleDeck.vue';
import DualDeck from '@/components/map/eternities/DualDeck.vue';
import NotifCenter from '@/components/board/NotifCenter.vue';
import ThemeSelector from '@/components/ThemeSelector.vue';

import MainMenu from '@/components/board/MainMenu.vue';
import OnlineControls from '@/components/board/OnlineControls.vue';
import DiceTray from '@/components/board/DiceTray.vue';


@Component({
  components: {
    Classic, SingleDeck, DualDeck,
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
      case MapType.CLASSIC:
        return Classic;
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
  bottom: calc(3.5rem + (.5rem / 2));
  right: calc(1rem + (.5rem / 2));
  width: calc(22rem - .5rem);
}

#landscape-guard {
  @media screen and (max-width: 480px) and (orientation: portrait) {
    & {
      display: flex;
    }
  }

  display: none;
  background-color: rgba(10, 10, 10, .95);
  z-index: 4269;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;

  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  .title {
    text-align: center;
    padding: 0 1rem;
  }
}
</style>
