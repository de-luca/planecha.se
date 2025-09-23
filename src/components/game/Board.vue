<template>
  <div class="board h-[100vh] overflow-hidden grid grid-cols-[5rem_1fr] gap-[1rem] pr-[1rem]">
	<div class="py-[1rem] h-full border-r flex flex-col items-center justify-between gap-1">
		<Maze mode="vertical" :dim="{ w: { v: 5, u: 'rem' } }" />
		<div class="font-[Arial] text-[1.5rem] leading-[3rem]">
			<div class="text-center hover:text-muted-foreground hover:cursor-pointer relative inline-block w-[1.5rem] z-1 rotate-180 translate-x-[0.8rem]">⟁</div>
			<div class="text-center hover:text-muted-foreground hover:cursor-pointer relative inline-block w-[1.5rem] z-2 ">⟁</div>
			<div class="text-center hover:text-muted-foreground hover:cursor-pointer relative inline-block w-[1.5rem] z-1 rotate-180 translate-x-[-0.3rem]">⟁</div>
		</div>
		<div class="grow-1"></div>
		<MapActions 
			:disabled="disableMapAction"
			@planeswalk="planeswalk"
			@chaos="chaos"
		/>
		<div class="grow-1"></div>
		<DiceMenu />
		<DungeonLink />
		<UndoBtn />
		<div class="grow-1"></div>
		<OnlineControls />
		<MainMenu />
		<div class="grow-3"></div>
		<DeckStatus />
	</div>


    <!-- <div class="nav">
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
    </div> -->

	<div class="h-full w-full overflow-y-auto">
      <component ref="game" :is="mapComponent" />
	</div>

    <Feed />

    <!-- <notif-center /> -->

    <StackWall v-if="cardsToStack" :cards="cardsToStack" @done="customChaos" />

    <component
      v-if="revealer && store.game.revealed"
      :is="revealer.component"
      :revealed="store.game.revealed"
      :config="revealer.config"
      @done="revealer!.resolver"
    />

  </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { Maze } from "@/components/controls";
import { type Card, Plane, SpecialPlane } from "@/model/card";
import type { EternitiesMapSpecs } from "@/model/game/eternities";
import { RevealerSource, StateKey } from "@/model/wall";
import { EventType, eventBus } from "@/services/eventBus";
import { useMain } from "@/store/main";
import { shuffle } from "@/utils/shuffle";
import { DualDeck, Multi, Single, SingleDeck } from "./board/game";
import {
	DeckStatus,
	DiceMenu,
	DungeonLink,
	Feed,
	MainMenu,
	MapActions,
	OnlineControls,
	UndoBtn,
} from "./board/menu";
import {
	getRevealer,
	type PickedLeft,
	type RevealConfig,
	StackWall,
} from "./board/wall";

type LocalRevealerConfig = {
	component: Component;
	seeder?: () => void;
	resolver: (choices: PickedLeft) => void;
	config: RevealConfig;
};

const store = useMain();
const game = useTemplateRef("game");

const cardsToStack = ref<Array<Card>>();

onMounted(() => {
	eventBus.on(EventType.STAIRS_TO_INFINITY, () => store.reveal({ count: 1 }));
	eventBus.on(EventType.POOLS_OF_BECOMING, () => store.reveal({ count: 3 }));
	eventBus.on(EventType.NORNS_SEEDCORE, () =>
		store.reveal({ count: 1, type: Plane }),
	);
	eventBus.on(EventType.THE_FERTILE_LANDS_OF_SAULVINIA, () =>
		store.reveal({ count: 1, type: Plane }),
	);
});

const mapComponent = computed(() => {
	switch (store.game.specs.type) {
		case "single":
			return Single;
		case "multi":
			return Multi;
		case "eternities":
			return (store.game.specs as EternitiesMapSpecs).subType === "single"
				? SingleDeck
				: DualDeck;
		default:
			throw new Error("Incompatible");
	}
});

const disableMapAction = computed(() => {
	if (
		revealer.value &&
		[
			RevealerSource.INTERPLANAR_TUNNEL,
			RevealerSource.SPACIAL_MERGING,
		].includes(revealer.value?.config.source)
	) {
		return store.game.revealed !== undefined;
	}

	return !store.game.walls.isEmpty();
});

const revealer = computed((): LocalRevealerConfig | undefined => {
	const revealer = store.game.walls.get(StateKey.REVEALER);

	if (!revealer) {
		return undefined;
	}

	const config = {
		component: getRevealer(revealer.component),
		config: {
			...revealer,
			mateName: revealer.initiator,
		},
	};

	switch (revealer.source) {
		case RevealerSource.STAIRS_TO_INFINITY:
			return {
				...config,
				resolver: (choices: PickedLeft) => {
					// store.pushOpToStack(Op.RESOLVE_REVEAL, {
					// 	top: choices.picked,
					// 	bottom: shuffle(choices.left),
					// });
					store.resolveReveal({
						top: choices.picked,
						bottom: shuffle(choices.left),
					});
					store.resolveStack();
				},
			};
		case RevealerSource.POOLS_OF_BECOMING:
			return {
				...config,
				resolver: (choices: PickedLeft) => {
					store.resolveReveal({
						top: choices.picked,
						bottom: shuffle(choices.left),
					});
					// store.pushOpToStack(Op.RESOLVE_REVEAL, {
					// 	top: choices.picked,
					// 	bottom: shuffle(choices.left),
					// });
					// store.resolveOpStack();

					if (useStack(choices.left)) {
						cardsToStack.value = [...choices.left];
					} else {
						for (const card of choices.left) {
							store.stack.push({ card });
						}
						store.resolveStack();
					}
				},
			};
		case RevealerSource.NORNS_SEEDCORE:
			return {
				...config,
				resolver: (choices) => {
					store.addActivePlane({ plane: choices.picked.pop() as Plane });
					store.resolveReveal({
						top: [],
						bottom: shuffle(choices.left),
					});
					store.resolveStack();
				},
			};
		case RevealerSource.THE_FERTILE_LANDS_OF_SAULVINIA:
			return {
				...config,
				resolver: (choices) => {
					// store.pushOpToStack(Op.RESOLVE_REVEAL, {
					// 	top: [],
					// 	bottom: shuffle([...choices.picked, ...choices.left]),
					// });
					store.resolveReveal({
						top: [],
						bottom: shuffle([...choices.picked, ...choices.left]),
					});
					// store.resolveOpStack();

					for (const card of choices.picked) {
						store.stack.push({ card });
					}
					store.resolveStack();
				},
			};
		case RevealerSource.INTERPLANAR_TUNNEL:
			return {
				...config,
				seeder: () => store.reveal({ count: 5, type: Plane }),
				resolver: customPlaneswalk,
			};
		case RevealerSource.SPACIAL_MERGING:
			return {
				...config,
				seeder: () => store.reveal({ count: 2, type: Plane }),
				resolver: customPlaneswalk,
			};
		case RevealerSource.CUSTOM:
			return {
				...config,
				resolver: (choices) =>
					store.privateResolveReveal({
						top: choices.picked,
						bottom: choices.left,
					}),
			};
	}

	return undefined;
});

const planeswalk = () => {
	if (revealer.value?.seeder) {
		revealer.value.seeder();
	} else {
		// @ts-expect-error
		game.value!.planeswalk();
	}
};

// biome-ignore lint/suspicious/noExplicitAny: ignore
const customPlaneswalk = (...args: any) =>
	// @ts-expect-error
	game.value!.customPlaneswalk(...args);

const chaos = () => {
	if (useStack(store.game.active)) {
		cardsToStack.value = [...store.game.active];
	} else {
		for (const card of store.game.active) {
			store.stack.push({ card });
		}
		store.resolveStack();
	}
};

const customChaos = (planes: Array<Plane>) => {
	cardsToStack.value = undefined;
	for (const card of planes.reverse()) {
		store.stack.push({ card });
	}
	store.resolveStack();
};

const useStack = (cards: Array<Card>) =>
	cards.length > 1 && cards.filter((c) => c instanceof SpecialPlane).length > 1;
</script>

<!-- <script lang="ts">
import shuffle from "lodash.shuffle";
import type { Component as VueComponent } from "vue";
import { Component, Vue } from "vue-facing-decorator";
import { type Card, Plane } from "@/model/card";
import { GameType, type Revealed } from "@/model/game";
import {
	type EternitiesMapSpecs,
	EternitiesMapSubType,
} from "@/model/game/eternities";
import { RevealerSource, StateKey } from "@/model/wall";
import { EventType, eventBus } from "@/services/eventBus";
import { Op, useMain } from "@/store/main";
import type { Game as CmpGame } from "#board/game/Game";
import { getRevealer } from "#board/wall/reveal/factory";
import type { PickedLeft, RevealConfig } from "#board/wall/reveal/types";

import DualDeck from "#board/game/eternities/DualDeck.vue";
import SingleDeck from "#board/game/eternities/SingleDeck.vue";
import Multi from "#board/game/multi/Multi.vue";
import Single from "#board/game/single/Single.vue";

import DeckStatus from "#board/menu/DeckStatus.vue";
import DiceBtn from "#board/menu/DiceBtn.vue";
import MainMenu from "#board/menu/MainMenu.vue";
import MapActions from "#board/menu/MapActions.vue";
import OnlineControls from "#board/menu/OnlineControls.vue";
import UndoBtn from "#board/menu/UndoBtn.vue";

import Feed from "#board/menu/Feed.vue";

import NotifCenter from "#board/menu/NotifCenter.vue";
import StackWall from "#board/wall/StackWall.vue";

type LocalRevealerConfig = {
	component: VueComponent;
	seeder: () => void;
	resolver: (choices: PickedLeft) => void;
	config: RevealConfig;
};

@Component({
	components: {
		Single,
		Multi,
		SingleDeck,
		DualDeck,
		MapActions,
		DiceBtn,
		UndoBtn,
		DeckStatus,
		OnlineControls,
		MainMenu,
		Feed,
		NotifCenter,
		StackWall,
	},
})
export default class Board extends Vue {
	private store = useMain();

	public stackWall = false;
	public stackWallCards: Array<Card> | null = null;

	public created() {
		eventBus.on(EventType.STAIRS_TO_INFINITY, () =>
			this.store.reveal({ count: 1 }),
		);
		eventBus.on(EventType.POOLS_OF_BECOMING, () =>
			this.store.reveal({ count: 3 }),
		);
		eventBus.on(EventType.NORNS_SEEDCORE, () =>
			this.store.reveal({ count: 1, type: Plane }),
		);
		eventBus.on(EventType.THE_FERTILE_LANDS_OF_SAULVINIA, () =>
			this.store.reveal({ count: 1, type: Plane }),
		);
	}

	public get mapComponent(): VueComponent {
		const specs = this.store.game.specs;

		switch (specs.type) {
			case GameType.SINGLE:
				return Single;
			case GameType.MULTI:
				return Multi;
			case GameType.ETERNITIES:
				return (specs as EternitiesMapSpecs).subType ===
					EternitiesMapSubType.SINGLE_DECK
					? SingleDeck
					: DualDeck;
			default:
				throw new Error("Incompatible");
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

		return !this.store.game.walls.isEmpty();
	}

	public get revealed(): Revealed | undefined {
		return this.store.game.revealed;
	}

	public get revealer(): LocalRevealerConfig | undefined {
		const revealer = this.store.game.walls.get(StateKey.REVEALER);

		if (!revealer) {
			return undefined;
		}

		const config = {
			component: getRevealer(revealer.component),
			config: {
				...revealer,
				mateName: revealer.initiator,
			},
		};

		switch (revealer.source) {
			case RevealerSource.STAIRS_TO_INFINITY:
				return {
					...config,
					seeder: () => {
						/* NOOP */
					},
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
					seeder: () => {
						/* NOOP */
					},
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
							for (const card of choices.left) {
								this.store.pushOpToStack(Op.CHAOS, { card });
							}
						}
					},
				};
			case RevealerSource.NORNS_SEEDCORE:
				return {
					...config,
					seeder: () => {
						/* NOOP */
					},
					resolver: (choices) => {
						this.store.addActivePlane({ plane: choices.picked.pop() as Plane });
						this.store.resolveReveal({
							top: [],
							bottom: shuffle(choices.left),
						});
					},
				};
			case RevealerSource.THE_FERTILE_LANDS_OF_SAULVINIA:
				return {
					...config,
					seeder: () => {
						/* NOOP */
					},
					resolver: (choices) => {
						this.store.pushOpToStack(Op.RESOLVE_REVEAL, {
							top: [],
							bottom: shuffle([...choices.picked, ...choices.left]),
						});
						for (const card of choices.picked) {
							this.store.pushOpToStack(Op.CHAOS, { card });
						}
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
					seeder: () => {
						/* NOOP */
					},
					resolver: (choices) =>
						this.store.privateResolveReveal({
							top: choices.picked,
							bottom: choices.left,
						}),
				};
		}

		return undefined;
	}

	public chaos(): void {
		if (this.useStack(this.store.game.active)) {
			this.stackWall = true;
		} else {
			for (const card of this.store.game.active) {
				this.store.chaos({ card });
			}
		}
	}

	public customChaos(planes: Array<Plane>): void {
		this.stackWallCards = null;
		this.stackWall = false;
		for (const card of planes.reverse()) {
			this.store.pushOpToStack(Op.CHAOS, { card });
		}
		this.store.resolveOpStack();
	}

	public planeswalk(): void {
		if (this.revealer?.seeder) {
			this.revealer.seeder();
			return;
		}

		(this.$refs.game as CmpGame).planeswalk();
	}

	public customPlaneswalk(
		...args: Parameters<CmpGame["customPlaneswalk"]>
	): ReturnType<CmpGame["customPlaneswalk"]> {
		(this.$refs.game as CmpGame).customPlaneswalk(...args);
	}

	public putBack(
		...args: Parameters<CmpGame["putBack"]>
	): ReturnType<CmpGame["putBack"]> {
		(this.$refs.game as CmpGame).putBack(...args);
	}

	private useStack(cards: Array<Card>): boolean {
		return (
			cards.length > 1 &&
			cards.filter((c) => c instanceof Plane && c.chaosRequireInterraction)
				.length > 1
		);
	}
}
</script> -->

<style lang="scss" scoped>
</style>

<!-- <style lang="scss" scoped>
.board {
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 5rem 1fr 20px;
  grid-template-areas: "nav game feed";
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

.game {
  grid-area: game;
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
</style> -->
