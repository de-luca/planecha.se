<template>
  <Dialog :open="!!tile" @update:open="emit('close')">
    <DialogContent class="bg-unset border-none w-[90vw] !max-w-[90vw]">
      <DialogHeader>
        <DialogTitle>{{ header?.title }}</DialogTitle>
        <DialogDescription>{{ header?.desc }}</DialogDescription>
      </DialogHeader>
      <div class="flex items-center justify-center gap-[1.5rem]">
        <div class="h-[80vh] grid gap-x-[1rem] overflow-y-auto" :class="layout">
          <div class="flex flex-col justify-center items-center" v-for="card in tile?.plane" :key="card.id">
            <Card :card="card" :ro="!current" />
          </div>
        </div>
        <Button
          v-if="tile && (Math.abs(tile.coords.x) + Math.abs(tile.coords.y) === 1)"
          class="h-min"
          variant="ghost"
          title="Planeswalk"
          @click="emit('planeswalk', { ...tile?.coords })"
        >
          <Planeswalk class="!h-15 !w-15 [&_path]:fill-(--foreground)"/>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Card } from "@/components/controls";
import { Planeswalk } from "@/components/svgs/symbols";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import type { Tile } from "@/model/game/eternities";
import { useMain } from "@/store";

const store = useMain();

const emit = defineEmits(["close", "planeswalk"]);
const { tile } = defineProps<{ tile?: Tile }>();

const current = computed(() => tile?.coords.x === 0 && tile.coords.y === 0);
const hasStarted = computed(() => store.game.hasStarted);
const reachable = computed(() =>
	tile ? Math.abs(tile?.coords.x) + Math.abs(tile.coords.y) <= 1 : true,
);

const header = computed(() => {
	switch (true) {
		case !hasStarted.value && current.value:
			return {
				title: "The starting plane",
				desc: "The game will start on this plane.",
			};
		case current.value:
			return {
				title: "You are here!",
				desc:
					tile?.plane.length === 1
						? "This is the currently active plane."
						: "These are the currently active planes.",
			};
		case !current.value && reachable.value:
			return {
				title: "Planeswalk here?",
				desc:
					tile?.plane.length === 1
						? "This plane is reachable."
						: "These planes are reachable.",
			};
		default:
			return {
				title: "Too far!",
				desc:
					tile?.plane.length === 1
						? "This plane is out of reach from your current position."
						: "These planes are out of reach from your current position.",
			};
	}
});

const layout = computed(() => {
	if (!tile) return "";
	switch (true) {
		case tile?.plane?.length >= 3:
			return "grid-cols-2 gap-y-[3rem] xl:[&_.outer]:h-full";
		case tile?.plane?.length === 2:
			return "grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-y-[1rem] py-[1rem] [&_.inner]:max-w-[800px] h-full md:[&_.outer]:h-fit";
		case tile?.plane?.length === 1:
			return "grid-cols-1 grid-rows-1 gap-y-[1rem] py-[1rem] [&_.inner]:max-w-[800px] [&_.outer]:flex [&_.outer]:flex-col [&_.outer]:justify-center [&_.outer]:items-center";
	}
});
</script>
