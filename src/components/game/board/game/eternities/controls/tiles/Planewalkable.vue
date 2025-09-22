<template>
  <div
    v-if="!hidden"
    title="Planeswalk"
    class="planeswalkable"
    @click="emit('show')"
  >
    <Card 
      v-if="tile?.plane.length === 1" 
      class="max-h-full max-w-full"
      :card="tile.plane[0]" 
      :ro="true" 
    />
    <Ellipsis v-else />
  </div>
  <div v-else>
    <img src="/cards/back.jpg" class="max-h-full max-w-full rounded-[3.5%/4.75%] drop-shadow-[1px_1px_1px_#585858]">
  </div>
</template>

<script setup lang="ts">
import { Ellipsis } from "lucide-vue-next";

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
export default class Planeswalkable extends Vue {
	@Prop({ required: false })
	public tile: Tile;
	@Prop({ required: true })
	public hidden: boolean;
}
</script> -->

<!-- <style lang="scss" scoped>
img {
  border-radius: var(--card-radius);
  max-height: 100%;
}

.planeswalkable:hover {
  z-index: 3;
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
