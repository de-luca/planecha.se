<template>
  <HoverCard>
    <HoverCardTrigger title="Effects on the stack" class="absolute top-1 right-1">
      <Button variant="outline" class="w-[3.5rem]">
        <Layers class="!h-full !w-full" />
      </Button>
    </HoverCardTrigger>
    <HoverCardContent align="end" side="bottom" class="z-200 w-[20rem] flex flex-col gap-2">
      <div class="flex items-center">
        <ChevronRight /> {{ stack.currentOp?.card?.name }}
      </div>
      <template v-if="stack.ops.length">
        <!-- <Separator /> -->
        <div v-for="op in stack.ops" class="flex items-center gap-2 pl-6">
          {{ op.card?.name }}
        </div>
      </template>
    </HoverCardContent>
  </HoverCard>
</template>

<script setup lang="ts">
import { ChevronRight, Layers } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";

import { useMain } from "@/store/main";

const stack = useMain().stack;
</script>