<template>
  <component :is="comp" />
</template>

<script setup lang="ts">
import { useMain } from "@/store/main";
import { computed } from "vue";
import { useRoute } from "vue-router";

import Board from "@/components/game/Board.vue";
import Join from "@/components/game/Join.vue";

const store = useMain();
const route = useRoute();

const comp = computed(() =>
	route.params.roomId && (!store.ready || !store._game) ? Join : Board,
);
</script>
