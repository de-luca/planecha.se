<template>
  <Dialog :open="!!board" @update:open="emit('close')">
    <DialogContent class="bg-unset border-none w-[90vw] !max-w-[90vw]">
      <DialogHeader>
        <DialogTitle>
          {{ board?.yours ? 'Your board' : board?.mate + '\'s board' }}
        </DialogTitle>
      </DialogHeader>
      <div class="flex items-center justify-center gap-[1.5rem]">
        <div class="h-[90vh] grid gap-x-[1rem] overflow-y-auto" :class="layout">
          <div class="flex flex-col justify-center items-center" v-for="card in board?.active" :key="card.id">
            <Card :card="card" :ro="!board?.yours" />
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts">
import type { Card as CardModel } from "@/model/card";

export type Board = {
	yours: boolean;
	mate: string;
	active: Array<CardModel>;
	started: boolean;
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import Card from "@/components/controls/Card.vue";

const emit = defineEmits(["close"]);
const { board } = defineProps<{ board?: Board }>();

const layout = computed(() => {
  if (!board) return "";
  switch (true) {
    case board.active.length >= 3:
      return "grid-cols-2 gap-y-[3rem] [&_.outer]:h-full";
    case board.active.length === 2:
      return "grid-cols-2 grid-rows-1 gap-y-[1rem] py-[1rem] [&_.inner]:max-w-[800px]"; // [&_.prout]:max-w-full"
    case board.active.length === 1:
      return "grid-cols-1 grid-rows-1 gap-y-[1rem] py-[1rem] [&_.inner]:max-w-[800px] [&_.outer]:flex [&_.outer]:flex-col [&_.outer]:justify-center [&_.outer]:items-center";
  }
});
</script>
