<template>
  <div 
    class="grid grid-rows-2 grid-flow-dense gap-[1rem] h-full py-[1rem]" 
    :class="layout"
  >
    <div 
      class="flex flex-col items-center justify-center gap-[.5rem] py-[1rem]" 
      v-for="(b, i) in boards" :key="i"
    >
      <Card v-if="b.active.length === 1" :card="b.active[0]" :hidden="!b.started" />
      <div v-else @click="shown = b">
        <Ellipsis />
      </div>
      <h1>{{ b.mate }}</h1>
    </div>
  </div>

  <BoardDetails
    :board="shown"
    @close="shown = undefined"
  />
</template>

<script setup lang="ts">
import { Ellipsis } from "lucide-vue-next";
import { computed, ref } from "vue";

import Card from "@/components/controls/Card.vue";
import type { Multi } from "@/model/game/multi/Multi";
import { useMain } from "@/store";
import { useGame } from "../game";
import { type Board, BoardDetails } from "./controls";

const store = useMain();
const { customPlaneswalk, putBack } = useGame();

const shown = ref<Board>();

const layout = computed(() => {
	switch (store.playerLayout.layout) {
		case "x2":
			return "grid-cols-2";
		case "x3":
			return "grid-cols-3";
	}
});

const boards = computed(() => {
	return store.playerLayout.players.reduce<Array<Board>>((acc, id) => {
		const game =
			id === "" ? store.game : (store.game as Multi).mateStates.get(id);

		if (game) {
			acc.push({
				yours: id === "",
				mate: store.getMateName(id),
				active: game.active,
				started: game.hasStarted,
			});
		}

		return acc;
	}, []);
});

const planeswalk = () => store.planeswalk({});

defineExpose({
	planeswalk,
	customPlaneswalk,
	putBack,
});
</script>

<!-- <script lang="ts">
import { Component } from "vue-facing-decorator";
import type { Card as ModelCard } from "@/model/card";
import type { Multi as MultiGame } from "@/model/game/multi/Multi";
import { Game } from "../Game";

import Card from "@/components/controls/Card.vue";

interface Active {
	yours: boolean;
	mate: string;
	active: Array<ModelCard>;
	started: boolean;
}

@Component({
	components: { Card },
})
export default class Multi extends Game {
	public shown: Active | null = null;

	public get layout(): Layout {
		return this.store.playerLayout.layout;
	}

	public get actives(): Array<Active> {
		return this.store.playerLayout.players.reduce<Array<Active>>((acc, id) => {
			const game =
				id === ""
					? this.store.game
					: (this.store.game as MultiGame).mateStates.get(id);

			if (game) {
				acc.push({
					yours: id === "",
					mate: this.store.getMateName(id),
					active: game.active,
					started: game.hasStarted,
				});
			}

			return acc;
		}, []);
		// return [{
		//   yours: true,
		//   mate: this.store.getMateName(),
		//   active: this.store.game.active,
		// }].concat(
		//   [...(this.store.game as MultiGame).mateStates.entries()]
		//     .map(([peer, map]) => ({
		//       yours: false,
		//       mate: this.store.getMateName(peer),
		//       active: map.active,
		//     })),
		// );
	}

	public planeswalk(): void {
		this.store.planeswalk({});
	}
}
</script> -->

<!-- <style lang="scss" scoped>
.wrapper {
  display: grid;
  grid-auto-flow: dense;
  grid-template-rows: calc((100vh - 3rem) / 2);
  gap: 1rem;

  height: 100%;
  padding: 1rem 0;

  &.x2 { grid-template-columns: repeat(2, 1fr) }
  &.x3 { grid-template-columns: repeat(3, 1fr) }


  .active {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: .5rem;
    padding: 1rem 0;

    div:first-of-type {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: calc((100vh - 3rem) / 2 - 5rem);
    }
  }
}

.details {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  padding: 2.5rem 1rem;
}
</style> -->
