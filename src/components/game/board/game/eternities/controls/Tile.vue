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

<!-- <script lang="ts">
import type { Component as VueComponent } from "vue";
import { Component, Prop, Vue } from "vue-facing-decorator";

import type { Tile as TileModel } from "@/model/game/eternities";
import Current from "./Current.vue";
import Hellrideable from "./Hellrideable.vue";
import Planewalkable from "./Planewalkable.vue";
import Unreachable from "./Unreachable.vue";

@Component({
	emits: ["show", "hellride"],
	components: {
		Current,
		Hellrideable,
		Planewalkable,
		Unreachable,
	},
})
export default class Tile extends Vue {
	@Prop({ required: false })
	public tile?: TileModel;
	@Prop({ required: true })
	public x: number;
	@Prop({ required: true })
	public y: number;
	@Prop({ required: true })
	public hidden: boolean;

	public get tileComponent(): VueComponent | undefined {
		if (this.tile) {
			if (Math.abs(this.x) + Math.abs(this.y) === 0) {
				return Current;
			}

			if (Math.abs(this.x) + Math.abs(this.y) === 1) {
				return Planewalkable;
			}

			if (!this.hidden) {
				return Unreachable;
			}
		}

		if (
			!this.hidden &&
			!this.tile &&
			Math.abs(this.x) + Math.abs(this.y) === 2 &&
			Math.abs(this.x) === 1 &&
			Math.abs(this.y) === 1
		) {
			return Hellrideable;
		}

		return undefined;
	}

	public hellride(): void {
		const coords: Coordinates = { x: this.x, y: this.y };
		this.$emit("hellride", coords);
	}

	public show(): void {
		this.$emit("show", this.tile);
	}
}
</script> -->

<!-- <style lang="scss" scoped>
.tile:hover {
  cursor: pointer;
}
</style> -->
