<template>
  <Accordion type="single" class="w-full h-[80vh] overflow-y-auto " collapsible>
    <AccordionItem v-for="precon in precons" :key="precon.name" :value="precon.name">
      <AccordionTrigger class="items-center" :class="{ 'text-muted-foreground': !precon.useable.useable }">
        <component class="grow-2 basis-0" :is="buildDesc(precon)" />
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
          <div>
							<DeckMenu :ro="true" :list="precon" />
          </div>
          <div>
            <Button 
              size="sm" 
              class="h-7"
              :disabled="!precon.useable.useable"
              @click.prevent.stop="$emit('use', toDeckList(precon))"
            >
              Use
            </Button>
          </div>
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
import { computed, h } from "vue";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPrecons } from "@/services/preconProvider";
import type { Precon } from "@/types";
import { CardCount, CardTable, DeckMenu } from "../controls";
import { type DeckList, isDeckListUseable, type Props } from "../utils";

const emit = defineEmits(["use"]);
const { minCards, maxCards, minPlanes, phenomena } = defineProps<Props>();

const precons = computed(() =>
	getPrecons().map((p) => ({
		...p,
		useable: isDeckListUseable(p, { minCards, maxCards, minPlanes, phenomena }),
	})),
);

const buildDesc = (precon: Precon) =>
	h("div", { class: "basis-1 grow" }, [
		h("div", { class: "flex" }, [
			h("strong", precon.name),
			h("div", { class: "ml-2" }),
			(precon.identity ?? []).map((pip) =>
				h("abbr", { class: `pip ${pip}` }, pip),
			),
		]),
		h("div", precon.face?.join(" / ")),
		h("small", { class: "text-muted-foreground" }, [
			`${precon.set.name} `,
			h("em", precon.set.code),
			` (${precon.set.year})`,
		]),
	]);

const toDeckList = (precon: Precon): DeckList => ({
	list: precon,
	component: buildDesc(precon),
});
</script>
