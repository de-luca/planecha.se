<template>
  <component :is="comp" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Board from "@/components/game/Board.vue";
import Join from "@/components/game/Join.vue";
import { useMain } from "@/store/main";

const store = useMain();
const route = useRoute();

const comp = computed(() =>
	route.params.roomId && (!store.ready || !store._game) ? Join : Board,
);
</script>
