<template>
  <div class="h-full grid gap-x-[1rem]" :class="layout">
    <div class="flex flex-col justify-center items-center" v-for="a in active" :key="a.id">
      <Card :card="a" :hidden="!hasStarted" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { Card } from "@/components/controls";

import { useMain } from "@/store";
import { useGame } from "../game";

const store = useMain();
const { hasStarted, customPlaneswalk, putBack } = useGame();

const active = computed(() => store.game.active);
const planeswalk = () => store.planeswalk({});

const layout = computed(() => {
	switch (true) {
		case active.value.length >= 3:
			return "grid-cols-2 grid-rows-2 gap-y-[3rem] py-[3rem] [&_.outer]:h-full";
		case active.value.length === 2:
			return "grid-cols-2 grid-rows-1 gap-y-[1rem] py-[1rem] [&_.inner]:max-w-[800px]";
		case active.value.length === 1:
			return "grid-cols-1 grid-rows-1 gap-y-[1rem] py-[1rem] [&_.inner]:max-w-[800px] [&_.outer]:flex [&_.outer]:flex-col [&_.outer]:justify-center [&_.outer]:items-center";
	}
});

defineExpose({
	planeswalk,
	customPlaneswalk,
	putBack,
});
</script>
