<template>
  <div class="h-full grid gap-x-[1rem]" :class="layout">
    <div class="flex flex-col justify-center items-center" v-for="a in active" :key="a.id">
      <Card :card="a" :hidden="!hasStarted" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import Card from "@/components/controls/Card.vue";

import { useMain } from "@/store";
import { useGame } from "../game";

const store = useMain();
const { hasStarted, customPlaneswalk, putBack } = useGame();

const active = computed(() => store.game.active);
const planeswalk = () => store.planeswalk({});

const layout = computed(() => {
	switch (true) {
		case active.value.length >= 7:
			return "grid-cols-3 grid-rows-3 gap-y-[3rem] py-[3rem]";
		case active.value.length >= 5:
			return "grid-cols-3 grid-rows-2 gap-y-[3rem] py-[3rem]";
		case active.value.length >= 3:
			return "grid-cols-2 grid-rows-2 gap-y-[3rem] py-[3rem] [&_.outer]:h-full";
		case active.value.length === 2:
			return "grid-cols-2 grid-rows-1 gap-y-[1rem] py-[1rem] [&_.inner]:max-w-[800px]"; // [&_.prout]:max-w-full"
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

<!-- <script lang="ts">
import { Component } from "vue-facing-decorator";
import type { Card as ModelCard } from "@/model/card";
import { Game } from "../Game";

import Card from "@/components/controls/Card.vue";

@Component({
	components: { Card },
})
export default class Single extends Game {
	public get active(): Array<ModelCard> {
		return this.store.game.active;
	}

	public planeswalk(): void {
		this.store.planeswalk({});
	}
}
</script> -->


<style lang="css" scoped>
/* // .card {
//   background: none;
//   box-shadow: none;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;

//   &:hover {
//     z-index: 2;
//   }
//   &:not(:hover) {
//     z-index: 1;
//   }
// }

// .active {
//   grid-area: active;

//   display: flex;
//   flex-direction: column;
//   justify-content: center;s
//   align-items: center;
//   height: 100%;
//   width: 100%; */

.buncha {
  height: auto;
  padding-top: 3rem;
  padding-bottom: 3rem;
  gap: 3rem;
}
/* // } */
</style>
