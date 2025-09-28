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
    <template v-else>
      <Ellipsis />
      {{ tile?.plane.length }} Planes
    </template>
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
