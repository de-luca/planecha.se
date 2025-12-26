<template>
  <Accordion type="single" class="w-full h-[80vh] overflow-y-auto" collapsible>
    <AccordionItem v-for="list in lists" :key="list.name" :value="list.name">
      <AccordionTrigger class="items-center" :class="{ 'text-muted-foreground': !list.useable.useable }">
        <component class="grow-2 basis-0" :is="list.descComp" />
        <CardCount :phenomena="phenomena" :counts="list.counts" />
        <div class="basis-0 grow-1 flex justify-end items-center gap-2 pr-2">
          <TooltipProvider v-if="!list.useable.useable">
            <Tooltip>
              <TooltipTrigger>
                <TriangleAlert />
              </TooltipTrigger>
              <TooltipContent>
                <p v-for="issue in list.useable.issues">{{ issue }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DeckMenu 
            :ro="true"
            :list="list" 
            :specs="{ minCards, maxCards, minPlanes, phenomena }"
            :useable="list.useable.useable"
            @use="emit('use', list)"
          />
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <CardTable :phenomena="phenomena" :cards="list.cards" />
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

import { buildDesc, isDeckListUseable, Props } from "../utils";

const specs = defineProps<Props>();
const emit = defineEmits(["use"]);

const decksStore = useDecks();

const lists = computed(() =>
	[...decksStore.lists.values()].map((l) => ({
		...l,
		descComp: buildDesc(l),
		useable: isDeckListUseable(l, specs),
	})),
);
</script>
