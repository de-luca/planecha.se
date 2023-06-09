<template>
  <div class="board">

    <div class="nav">
      <div class="brand">
        <div>⟁</div>
        <div>⟁</div>
        <div>⟁</div>
      </div>
      <div class="spacer"></div>
      <MapActions @planeswalk="planeswalk" @chaos="chaos" />
      <DiceBtn />
      <UndoBtn />
      <div class="spacer"></div>
      <OnlineControls />
      <MainMenu />
      <div class="spacer"></div>
      <div class="spacer"></div>
      <DeckStatus />
    </div>

    <div class="map-container">
      <component ref="map" :is="mapComponent" />
    </div>

    <Feed class="feed" />

    <notif-center />

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { Component as VueComponent } from 'vue';
import { useMain } from '#/store/main';
import { MapType } from '#/model/map';
import { EternitiesMapSpecs, EternitiesMapSubType } from '#/model/map/eternities';

import { Map as CmpMap } from '#board/map/Map';

import Single from '#board/map/single/Single.vue';
import Multi from '#board/map/multi/Multi.vue';
import SingleDeck from '#board/map/eternities/SingleDeck.vue';
import DualDeck from '#board/map/eternities/DualDeck.vue';
import NotifCenter from '#board/NotifCenter.vue';
import ThemeSelector from '#/components/controls/ThemeSelector.vue';

import MainMenu from '#board/menu/MainMenu.vue';
import OnlineControls from '#board/menu/OnlineControls.vue';

import DiceBtn from '#board/menu/DiceBtn.vue';
import DeckStatus from '#board/menu/DeckStatus.vue';
import UndoBtn from '#board/menu/UndoBtn.vue';
import MapActions from '#board/menu/MapActions.vue';

import Feed from '#board/feed/Feed.vue';

@Component({
  components: {
    DeckStatus, DiceBtn, UndoBtn, MapActions, Feed,

    Single, Multi, SingleDeck, DualDeck,
    NotifCenter,
    ThemeSelector, MainMenu, OnlineControls,
  },
})
export default class Board extends Vue {
  private store = useMain();

  public get mapComponent(): VueComponent {
    const specs = this.store.map.specs;

    switch (specs.type) {
      case MapType.SINGLE:
        return Single;
      case MapType.MULTI:
        return Multi;
      case MapType.ETERNITIES:
        return (specs as EternitiesMapSpecs).subType === EternitiesMapSubType.SINGLE_DECK
          ? SingleDeck
          : DualDeck;
      default:
        throw new Error('Incompatible');
    }
  }

  public get online(): boolean {
    return !!this.store.net;
  }

  public planeswalk(): void {
    (this.$refs.map as CmpMap).planeswalk();
  }

  public chaos() {
    (this.$refs.map as CmpMap).chaos();
  }
}
</script>

<style lang="scss" scoped>
.board {
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 5rem 1fr 20px;
  grid-template-areas: "nav map feed";
  gap: 1rem;
}

.nav {
  grid-area: nav;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: .5rem;
  z-index: 420;

  padding-top: 1rem;
  padding-bottom: 1rem;

  border-right: 1px solid var(--border-color);

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
      font-size: 1.5rem;
      line-height: 3rem;
      width: 1.5rem;
      text-align: center;

      &:hover {
        cursor: pointer;
        color: var(--brand-color-secondary);
      }

      &:nth-child(1) {
        transform: rotate(180deg)
      }
      &:nth-child(2) {
        transform: translateX(-.9rem);
        z-index: 2;
      }
      &:nth-child(3) {
        transform: rotate(180deg) translateX(1.3rem);
        position: absolute;
      }
    }
  }
}

.feed {
  grid-area: feed;
}

.map-container {
  grid-area: map;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
}

.notif-center {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  width: calc(22rem - .5rem);
}
</style>
