<template>
  <Button 
    variant="ghost" 
    class="w-[3.5rem]"
    :disabled="!canUndo"
    @click="store.undo"
    @keyup.space.prevent
    :title="canUndo ? 'Undo last action' : 'No action to undo'"
  >
    <Undo class="!h-full !w-full"/>
  </Button>
</template>

<script setup lang="ts">
import { Undo } from "lucide-vue-next";
import { computed } from "vue";

import { Button } from "@/components/ui/button";

import { useMain } from "@/store/main";

const store = useMain();
const canUndo = computed(() => store.repo.head > 0);
</script>
