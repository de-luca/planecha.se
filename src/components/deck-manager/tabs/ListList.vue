<template>
  <Accordion type="single" class="w-full h-[80vh] overflow-y-auto" collapsible>
    <AccordionItem v-for="list in getLists()" :key="list.name" :value="list.name">
      <AccordionTrigger class="items-center">
        <component class="grow-2 basis-0" :is="buildDesc(list)" />
        <CardCount :phenomena="phenomena" :counts="list.counts" />
        <div class="basis-1 grow text-right pr-3">
          <Button variant="outline" size="sm" class="h-7" @click.prevent.stop="$emit('use', toDeckList(list))">
            Use
          </Button>
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
import { h } from 'vue';

import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

import {
  CardCount, 
  CardTable,
} from '../controls';

import { getLists } from '@/services/listProvider';
import { List } from '@/types/index';

import { Props } from '../utils';

const { minCards, maxCards, minPlanes, phenomena } = defineProps<Props>();
const emit = defineEmits(['use']);
</script>
