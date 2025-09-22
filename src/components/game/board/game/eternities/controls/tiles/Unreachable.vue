<template>
  <div class="grayscale-90" @click="emit('show')">
    <Card 
      v-if="tile?.plane.length === 1" 
      class="max-h-full max-w-full"
      :card="tile.plane[0]" 
      :ro="true"
    />
    <Ellipsis v-else :title="tile?.plane.length + 'planes'" />
  </div>

  <!-- <div class="unreachable" @click="$emit('show')">
    <card v-if="tile.plane.length === 1" :card="tile.plane[0]" :ro="true" />
    <fa v-else :title="tile.plane.length + 'planes'" icon="ellipsis" size="2xl" />
  </div> -->
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
export default class Unreachable extends Vue {
	@Prop({ required: false })
	public tile: Tile;
	@Prop({ required: true })
	public hidden: boolean;
}
</script> -->

<!-- <style lang="scss" scoped>
.unreachable {
  filter: grayscale(90%);
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
