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
