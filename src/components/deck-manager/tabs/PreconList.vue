<template>
  <Accordion type="single" class="w-full h-[80vh] overflow-y-auto " collapsible>
    <AccordionItem v-for="precon in precons" :key="precon.name" :value="precon.name">
      <AccordionTrigger class="items-center" :class="{ 'text-muted-foreground': !precon.useable.useable }">
        <component class="grow-2 basis-0" :is="precon.descComp" />
        <CardCount :phenomena="phenomena" :counts="precon.counts" />
        <div class="basis-1 grow flex justify-end items-center gap-3 pr-3">
          <TooltipProvider v-if="!precon.useable.useable">
            <Tooltip>
              <TooltipTrigger>
                <TriangleAlert />
              </TooltipTrigger>
              <TooltipContent>
                <p v-for="issue in precon.useable.issues">{{ issue }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DeckMenu 
            :ro="true"
            :list="precon" 
            :specs="{ minCards, maxCards, minPlanes, phenomena }"
            :useable="precon.useable.useable"
            @use="emit('use', precon)"
          />
        </div> 
      </AccordionTrigger>
      <AccordionContent>
        <CardTable :phenomena="phenomena" :cards="precon.cards" />
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>

<script setup lang="ts">
import { TriangleAlert } from "lucide-vue-next";
import { computed } from "vue";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDecks } from "@/store";

import { CardCount, CardTable, DeckMenu } from "../controls";
import { buildDesc, isDeckListUseable, type Props } from "../utils";

const specs = defineProps<Props>();
const emit = defineEmits(["use"]);

const decksStore = useDecks();

const precons = computed(() =>
	[...decksStore.precons.values()].map((p) => ({
		...p,
		descComp: buildDesc(p),
		useable: isDeckListUseable(p, specs),
	})),
);
</script>
