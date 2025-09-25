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

import { Card } from "@/components/controls";
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
