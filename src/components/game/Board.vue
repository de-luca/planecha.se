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

	<div class="h-full w-full overflow-y-auto">
      <component ref="game" :is="mapComponent" />
	</div>

    <Feed />

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
					store.resolveReveal({
						top: [],
						bottom: shuffle([...choices.picked, ...choices.left]),
					});
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
