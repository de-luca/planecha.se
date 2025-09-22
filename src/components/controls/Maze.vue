<template>
  <div 
    class="maze" 
    :style="contentStyle"
    id="canary" 
    aria-hidden="true" 
    v-html="GLYPHS"
  ></div>
  <div 
    class="maze" 
    :style="{ ...contentStyle, ...containerStyle }"
    aria-hidden="true" 
    v-html="pattern"
  ></div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";

const GLYPHS = Math.random().toString(36).substring(2, 6);

const rows = ref(0);
const cols = ref(0);

const {
	mode = "screen",
	dim = {
		h: { v: 0, u: "px" },
		w: { v: 0, u: "px" },
	},
} = defineProps<{
	mode?: "screen" | "parent" | "vertical";
	dim?: {
		h?: {
			v: number;
			u: "px" | "rem" | "vh";
		};
		w?: {
			v: number;
			u: "px" | "rem" | "vw";
		};
	};
}>();

const pattern = computed(() => {
	let pattern = "";

	for (let r = 0; r < rows.value; r++) {
		for (let c = 0; c < cols.value; c++) {
			pattern += GLYPHS;
		}
		pattern += "<br>";
	}

	return pattern;
});

const contentStyle = computed(() => {
	switch (mode) {
		case "screen":
			return { "font-size": "10vh" };
		case "parent":
			return { "font-size": `5${dim.h?.u}` };
		case "vertical":
			return {
				"font-size": `${dim.w?.v}${dim.w?.u}`,
				"writing-mode": "vertical-rl",
				"text-orientation": "mixed",
			};
	}
});

const containerStyle = computed(() => {
	switch (mode) {
		case "screen":
			return { width: "100vw" };
		case "parent":
			return { width: "100vw" };
		case "vertical":
			return {
				width: `${dim.w?.v}${dim.w?.u}`,
				height: "100%",
			};
	}
});

onMounted(() => {
	nextTick(computeDimensions);
	window.addEventListener("resize", computeDimensions);
});

onUnmounted(() => window.removeEventListener("resize", computeDimensions));

const computeDimensions = () => {
	const canary = document.getElementById("canary") as HTMLElement;
	switch (mode) {
		case "screen":
			rows.value = 10;
			cols.value = Math.ceil(window.innerWidth / canary.clientWidth);
			break;
		case "parent": {
			const parent = canary.parentElement;
			rows.value = dim.h?.v! / 5;
			cols.value = Math.ceil((parent?.clientWidth ?? 0) / canary.clientWidth);
			break;
		}
		case "vertical": {
			const parent = canary.parentElement;
			rows.value = dim.w?.v! / 5;
			cols.value = Math.ceil((parent?.clientHeight ?? 0) / canary.clientHeight);
			break;
		}
	}
};
</script>

<style lang="css" scoped>
.maze {
  font-family: 'MazeletterUtopia';
  color: var(--maze-color);
  display: block;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  text-align: left;
  /* font-size: 10vh; */
  line-height: 1em;
  overflow: hidden;
  white-space: nowrap;
  pointer-events: none;
  /* width: 100vw; */
}

#canary {
  position: absolute;
  visibility: hidden;
  height: auto;
  width: auto;
  white-space: nowrap;
}
</style>
