<template>
  <Accordion type="single" class="w-full h-[80vh] overflow-y-auto" collapsible>
    <AccordionItem v-for="list in lists" :key="list.name" :value="list.name">
      <AccordionTrigger class="items-center" :class="{ 'text-muted-foreground': !list.useable.useable }">
        <component class="grow-2 basis-0" :is="buildDesc(list)" />
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
          <div>
							<DeckMenu :ro="true" :list="list" />
          </div>
          <div>
            <Button 
              size="sm" 
              class="h-7"
              :disabled="!list.useable.useable"
              @click.prevent.stop="$emit('use', toDeckList(list))"
            >
              Use
            </Button>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <CardTable :phenomena="phenomena" :cards="list.cards" />
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>

<script lang="ts">
import { getDefaultList } from "@/services/listProvider";
import type { DeckList } from "../utils";

const buildDesc = (list: List) =>
	h("div", { class: "basis-1 grow" }, [
		h("div", { class: "flex" }, h("strong", list.name)),
		h("div", { class: "text-muted-foreground" }, list.desc),
	]);

const toDeckList = (list: List): DeckList => ({
	list: list,
	component: buildDesc(list),
});

export const DEFAULT_LIST = toDeckList(getDefaultList());
</script>

<script setup lang="ts">
import { TriangleAlert } from "lucide-vue-next";
import { computed, h } from 'vue';

import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  CardCount, 
  CardTable,
  DeckMenu,
} from '../controls';

import { getLists } from '@/services/listProvider';
import { List } from '@/types';

import { isDeckListUseable, Props } from '../utils';

const { minCards, maxCards, minPlanes, phenomena } = defineProps<Props>();
const emit = defineEmits(['use']);

const lists = computed(() =>
	getLists().map((l) => ({
		...l,
		useable: isDeckListUseable(l, { minCards, maxCards, minPlanes, phenomena }),
	})),
);
</script>
