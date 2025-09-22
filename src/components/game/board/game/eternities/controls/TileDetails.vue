<template>
  <Dialog :open="!!tile" @update:open="emit('close')">
    <DialogContent class="bg-unset border-none w-[90vw] !max-w-[90vw]">
      <div class="flex items-center justify-center gap-[1.5rem]">
        <div class="h-[90vh] grid gap-x-[1rem] overflow-y-auto" :class="layout">
          <div class="flex flex-col justify-center items-center" v-for="card in tile?.plane" :key="card.id">
            <Card :card="card" :ro="!current" />
          </div>
        </div>
        <!-- <Card v-for="card in tile?.plane" :key="card.id" :card="card" :ro="!current" /> -->
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


  <!-- <div class="modal tile-display">
    <div class="modal-background" title="Close" @click="$emit('close')"></div>
    <div class="modal-content">
      <div class="wrapper">
        <card v-for="card in tile.plane" :key="card.id" :card="card" :ro="!current" />
        <button
          v-if="(Math.abs(tile.coords.x) + Math.abs(tile.coords.y) === 1)"
          class="button is-ghost planeswalk-btn"
          title="Planeswalk"
          @click="$emit('planeswalk', { ...tile.coords })"
        >
          <Planeswalk class="icn is-primary" />
        </button>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" title="Close" @click="$emit('close')"></button>
  </div> -->
</template>

<script setup lang="ts">
import { computed } from "vue";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import Card from "@/components/controls/Card.vue";
import { Planeswalk } from "@/components/svgs/symbols";

import type { Tile } from "@/model/game/eternities";
import { useMain } from "@/store";

const store = useMain();

const emit = defineEmits(["close", "planeswalk"]);
const { tile } = defineProps<{ tile?: Tile }>();

const current = computed(() => tile?.coords.x === 0 && tile.coords.y === 0);
const hasStarted = computed(() => store.game.hasStarted);

const layout = computed(() => {
	if (!tile) return "";
	switch (true) {
		case tile?.plane?.length >= 7:
		//   return "grid-cols-3 grid-rows-3 gap-y-[3rem]";
		// case tile?.plane?.length >= 5:
		//   return "grid-cols-3 grid-rows-2 gap-y-[3rem]";
		case tile?.plane?.length >= 3:
			return "grid-cols-2 gap-y-[3rem] [&_.outer]:h-full";
		case tile?.plane?.length === 2:
			return "grid-cols-2 grid-rows-1 gap-y-[1rem] py-[1rem] [&_.inner]:max-w-[800px]"; // [&_.prout]:max-w-full"
		case tile?.plane?.length === 1:
			return "grid-cols-1 grid-rows-1 gap-y-[1rem] py-[1rem] [&_.inner]:max-w-[800px] [&_.outer]:flex [&_.outer]:flex-col [&_.outer]:justify-center [&_.outer]:items-center";
	}
});
</script>

<!-- <script lang="ts">
import { Component, Prop } from "vue-facing-decorator";
import { Imgable } from "@/components/Imgable";
import type { Plane } from "@/model/card";
import type { Tile } from "@/model/game/eternities";
import { useMain } from "@/store/main";

import Card from "@/components/controls/Card.vue";
import { Planeswalk } from "@/components/svgs/symbols";

@Component({
	emits: ["close", "planeswalk"],
	components: { Planeswalk, Card },
})
export default class TileDetails extends Imgable {
	@Prop({ required: true })
	public tile: Tile;

	private store = useMain();

	public get current(): boolean {
		return this.tile.coords.x === 0 && this.tile.coords.y === 0;
	}

	public get hasStarted(): boolean {
		return this.store.game.hasStarted;
	}

	public update(plane: Plane, change: number): void {
		this.store.updateCounters({ planeId: plane.id, change });
	}

	public imgSrc(plane: Plane): string {
		return this.buildImgSrc(plane);
	}
}
</script> -->

<!-- <style lang="scss" scoped>
.modal {
  display: flex;
  flex-direction: row;
  overflow-y: scroll;

  .modal-background {
    cursor: pointer;
  }

  .modal-content {
    overflow-y: inherit;

    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2.5rem;
      padding: 2.5rem 1rem;

      .planeswalk-btn {
        height: 6rem;
      }
    }
  }
}
</style> -->
