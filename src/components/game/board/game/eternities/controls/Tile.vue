<template>
  <component
    v-if="tileComponent"
	class="hover:cursor-pointer"
    :is="tileComponent"
    :tile="tile"
    :hidden="hidden"
    @hellride="hellride"
    @show="show"
  />
  <div v-else></div>
</template>

<script setup lang="ts">
import { type Component, computed } from "vue";
import type { Tile as TileModel } from "@/model/game/eternities";
import { Current, Hellrideable, Planewalkable, Unreachable } from "./tiles";

const emit = defineEmits(["show", "hellride"]);
const { tile, x, y, hidden } = defineProps<{
	tile?: TileModel;
	x: number;
	y: number;
	hidden: boolean;
}>();

const tileComponent = computed((): Component | undefined => {
	const xAbs = Math.abs(x);
	const yAbs = Math.abs(y);

	if (tile) {
		if (xAbs + yAbs === 0) return Current;
		if (xAbs + yAbs === 1) return Planewalkable;
		if (!hidden) return Unreachable;
	}

	if (!hidden && !tile && xAbs + yAbs === 2 && xAbs === 1 && yAbs === 1) {
		return Hellrideable;
	}

	return undefined;
});

const hellride = () => emit("hellride", { x, y });
const show = () => emit("show", tile);
</script>
