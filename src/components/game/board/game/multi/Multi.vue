<template>
  <div 
    class="grid grid-rows-2 grid-flow-dense gap-[1rem] h-full py-[1rem]" 
    :class="layout"
  >
	<div 
      class="flex flex-col justify-center items-center pt-[3rem] [&_.inner]:max-w-[800px] xl:[&_.outer]:h-full" 
      v-for="(b, i) in boards" :key="i"
    >
		<div class="flex items-center justify-center w-full h-[90%]">
			<Card v-if="b.active.length === 1" :card="b.active[0]" :hidden="!b.started" />
			<Button v-else class="flex flex-col h-50 w-75" variant="ghost" @click="shown = b">
				<Ellipsis class="!h-10 !w-10" />
				{{ b.active.length }} Planes
			</Button>
		</div>
		
      	<div class="h-[10%] flex items-center text-md text-muted-foreground">
			{{ b.mate }}
		</div>
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
import { Button } from "@/components/ui/button";
import type { Multi } from "@/model/game/multi/Multi";
import { useMain } from "@/store";
import { useGame } from "../game";
import { BoardDetails } from "./controls";
import { Board } from "./types";

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
