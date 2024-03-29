<template>
  <div class="board">

    <div class="nav">
      <div class="brand">
        <div>⟁</div>
        <div>⟁</div>
        <div>⟁</div>
      </div>
      <div class="spacer"></div>
      <MapActions
        :disabled="disableMapAction"
        @planeswalk="planeswalk"
        @chaos="chaos"
      />
      <div class="spacer"></div>
      <DiceBtn />
      <tip>
        <template #btn>
          <l class="button is-ghost" href="https://dungeon.planecha.se">
            <fa icon="dungeon" fixed-width size="lg" />
          </l>
        </template>
        <template #tip>
          Dungeon tracker<br>
          <em>external</em>
        </template>
      </tip>
      <UndoBtn />
      <div class="spacer"></div>
      <OnlineControls />
      <MainMenu />
      <DeckStatus class="status" />
    </div>

    <div class="map">
      <component ref="map" :is="mapComponent" />
    </div>

    <Feed class="feed" />

    <notif-center />

    <StackWall v-if="stackWall" :cards="stackWallCards" @done="customChaos" />

    <component
      v-if="revealer && revealed"
      :is="revealer.component"
      :revealed="revealed"
      :config="revealer.config"
      @done="revealer!.resolver"
    />

  </div>
</template>

<script lang="ts">
import shuffle from 'lodash.shuffle';
import { Component, Vue } from 'vue-facing-decorator';
import { Component as VueComponent } from 'vue';
import { Op, useMain } from '#/store/main';
import { MapType, Revealed } from '#/model/map';
import { EternitiesMapSpecs, EternitiesMapSubType } from '#/model/map/eternities';
import { Card, Plane } from '#/model/card';
import { eventBus, EventType } from '#/services/EventBus';
import { PickedLeft, RevealConfig } from '#board/wall/reveal/types';
import { RevealerWallState, StateKey, RevealerSource } from '#/model/wall';
import { RevealFactory } from '#board/wall/reveal/RevealFactory';
import { Map as CmpMap } from '#board/map/Map';

import Single from '#board/map/single/Single.vue';
import Multi from '#board/map/multi/Multi.vue';
import SingleDeck from '#board/map/eternities/SingleDeck.vue';
import DualDeck from '#board/map/eternities/DualDeck.vue';

import MapActions from '#board/menu/MapActions.vue';
import DiceBtn from '#board/menu/DiceBtn.vue';
import UndoBtn from '#board/menu/UndoBtn.vue';
import OnlineControls from '#board/menu/OnlineControls.vue';
import MainMenu from '#board/menu/MainMenu.vue';
import DeckStatus from '#board/menu/DeckStatus.vue';

import Feed from '#board/menu/Feed.vue';

import NotifCenter from '#board/menu/NotifCenter.vue';
import StackWall from '#board/wall/StackWall.vue';

type LocalRevealerConfig = {
  component: VueComponent;
  seeder: () => void;
  resolver: (choices: PickedLeft) => void;
  config: RevealConfig;
}

@Component({
  components: {
    Single, Multi, SingleDeck, DualDeck,
    MapActions, DiceBtn, UndoBtn, DeckStatus,
    OnlineControls, MainMenu,
    Feed,
    NotifCenter, StackWall,
  },
})
export default class Board extends Vue {
  private store = useMain();

  public stackWall = false;
  public stackWallCards: Array<Card> | null = null;

  public created() {
    eventBus.on(EventType.STAIRS_TO_INFINITY, () => this.store.reveal({ count: 1 }));
    eventBus.on(EventType.POOLS_OF_BECOMING, () => this.store.reveal({ count: 3 }));
    eventBus.on(EventType.NORNS_SEEDCORE, () => this.store.reveal({ count: 1, type: Plane }));
    eventBus.on(EventType.THE_FERTILE_LANDS_OF_SAULVINIA, () => this.store.reveal({ count: 1, type: Plane }));
  }

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

  public get disableMapAction(): boolean {
    if (
      this.revealer &&
      [
        RevealerSource.INTERPLANAR_TUNNEL,
        RevealerSource.SPACIAL_MERGING,
      ].includes(this.revealer?.config.source)
    ) {
      return this.revealed !== undefined;
    }

    return this.store.map.wallStates.size !== 0;
  }

  public get revealed(): Revealed | undefined {
    return this.store.map.revealed;
  }

  public get revealer(): LocalRevealerConfig | undefined {
    const revealer =
      this.store.map.wallStates.get<RevealerWallState>(StateKey.REVEALER);

    if (!revealer) {
      return undefined;
    }

    const config = {
      component: RevealFactory.get(revealer.component),
      config: {
        ...revealer,
        mateName: revealer.initiator,
      },
    };

    switch (revealer.source) {
      case RevealerSource.STAIRS_TO_INFINITY:
        return {
          ...config,
          seeder: () => { /* NOOP */ },
          resolver: (choices: PickedLeft) => {
            this.store.pushOpToStack(Op.RESOLVE_REVEAL, {
              top: choices.picked,
              bottom: shuffle(choices.left),
            });
            this.store.resolveOpStack();
          },
        };
      case RevealerSource.POOLS_OF_BECOMING:
        return {
          ...config,
          seeder: () => { /* NOOP */ },
          resolver: (choices: PickedLeft) => {
            this.store.pushOpToStack(Op.RESOLVE_REVEAL, {
              top: choices.picked,
              bottom: shuffle(choices.left),
              stop: true,
            });
            this.store.resolveOpStack();

            if (this.useStack(choices.left)) {
              this.stackWallCards = choices.left;
              this.stackWall = true;
            } else {
              choices.left.forEach(card => this.store.pushOpToStack(Op.CHAOS, { card }));
            }
          },
        };
      case RevealerSource.NORNS_SEEDCORE:
        return {
          ...config,
          seeder: () => { /* NOOP */ },
          resolver: (choices) => {
            this.store.addActivePlane({ plane: choices.picked.pop() as Plane });
            this.store.resolveReveal({ top: [], bottom: shuffle(choices.left) });
          },
        };
      case RevealerSource.THE_FERTILE_LANDS_OF_SAULVINIA:
        return {
          ...config,
          seeder: () => { /* NOOP */ },
          resolver: (choices) => {
            this.store.pushOpToStack(Op.RESOLVE_REVEAL, {
              top: [],
              bottom: shuffle([...choices.picked, ...choices.left]),
            });
            choices.picked.forEach(card => this.store.pushOpToStack(Op.CHAOS, { card }));
            this.store.resolveOpStack();
          },
        };
      case RevealerSource.INTERPLANAR_TUNNEL:
        return {
          ...config,
          seeder: () => this.store.reveal({ count: 5, type: Plane }),
          resolver: this.customPlaneswalk,
        };
      case RevealerSource.SPACIAL_MERGING:
        return {
          ...config,
          seeder: () => this.store.reveal({ count: 2, type: Plane }),
          resolver: this.customPlaneswalk,
        };
      case RevealerSource.CUSTOM:
        return {
          ...config,
          seeder: () => { /* NOOP */ },
          resolver: (choices) => this.store.privateResolveReveal({
            top: choices.picked,
            bottom: choices.left,
          }),
        };
    }
  }

  public chaos(): void {
    if (this.useStack(this.store.map.active)) {
      this.stackWall = true;
    } else {
      this.store.map.active.forEach(card => this.store.chaos({ card }));
    }
  }

  public customChaos(planes: Array<Plane>): void {
    this.stackWallCards = null;
    this.stackWall = false;
    planes
      .reverse()
      .forEach(card => this.store.pushOpToStack(Op.CHAOS, { card }));
    console.log(this.store.opStack);
    this.store.resolveOpStack();
  }

  public planeswalk(): void {
    if (this.revealer?.seeder) {
      return this.revealer.seeder();
    }

    (this.$refs.map as CmpMap).planeswalk();
  }

  public customPlaneswalk(
    ...args: Parameters<CmpMap['customPlaneswalk']>
  ): ReturnType<CmpMap['customPlaneswalk']> {
    (this.$refs.map as CmpMap).customPlaneswalk(...args);
  }

  public putBack(
    ...args: Parameters<CmpMap['putBack']>
  ): ReturnType<CmpMap['putBack']> {
    (this.$refs.map as CmpMap).putBack(...args);
  }

  private useStack(cards: Array<Card>): boolean {
    return cards.length > 1 &&
      cards
        .filter(c => c instanceof Plane && c.chaosRequireInterraction)
        .length > 1;
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

  .status {
    @media screen and (max-height: 720px) {
      display: none;
    }
    flex-grow: 2;
  }
}

.feed {
  grid-area: feed;
}

.map {
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
  left: 6rem;
  width: calc(22rem - .5rem);
}
</style>
