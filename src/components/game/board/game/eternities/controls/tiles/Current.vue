<template>
  <div 
    title="You are here ;)" 
    class="relative" 
    @click="emit('show')"
  >
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
