<template>
  <div 
    title="You are here ;)" 
    class="relative" 
    @click="emit('show')"
  >
    <!-- <MapPin class="absolute top-0 left-0 z-2"/> -->
    <Card
      v-if="tile?.plane.length === 1"
      class="max-h-full max-w-full"
      :card="tile.plane[0]"
      :current="true"
      :hasStarted="!hidden"
    />
    <div 
      v-else 
      class="flex flex-col gap-1"
      :title="tile?.plane.length + ' planes'"
    >
      <MapPin />
      <Ellipsis />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ellipsis, MapPin } from "lucide-vue-next";

import type { Tile } from "@/model/game/eternities";
import Card from "../Card.vue";

const { tile, hidden } = defineProps<{
	tile?: Tile;
	hidden: boolean;
}>();
const emit = defineEmits(["show"]);
</script>

<!-- <script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";
import type { Tile } from "@/model/game/eternities";

import Card from "@/components/controls/Card.vue";

@Component({
	emits: ["show"],
	components: { Card },
})
export default class Current extends Vue {
	@Prop({ required: false })
	public tile: Tile;
	@Prop({ required: true })
	public hidden: boolean;
}
</script> -->

<!-- <style lang="scss" scoped>
img {
  border-radius: var(--card-radius);
}

.current {
  position: relative;
  z-index: 2;

  .marker {
    z-index: 3;
    position: absolute;
    top: 1rem;
    left: 1rem;
    color: var(--brand-color-secondary);
  }

  &:hover .marker {
    color: var(--brand-color-primary);
  }
}

.multi {
  width: 100%;
  position: relative;

  div:first-of-type {
    position: absolute;
    top: -.5rem;
    left: -1rem;
  }

  div:last-of-type {
    position: absolute;
    bottom: -.5rem;
    right: -1rem;
  }
}
</style> -->
