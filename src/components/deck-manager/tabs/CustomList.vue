<template>
  	<div class="h-[80vh]" >
		<div 
			v-if="decksStore.decks.size === 0"
			class="h-full w-full flex flex-col justify-center items-center gap-5"
		>
			<div class="text-xl text-muted-foreground">
				You don't have any custom decks.
			</div>
			<div class="flex gap-2">
				<Button variant="default" @click="emit('build')">
					Build your own
				</Button>
				<Button variant="secondary" @click="tab = 'precons'">
					Use a preconstructed deck
				</Button>
				<Button variant="outline" @click="tab = 'lists'">
					Use a card list
				</Button>
			</div>
		</div>

		<Accordion v-else type="single" class="w-full h-[80vh] overflow-y-auto" collapsible>
			<AccordionItem v-for="deck in decks" :key="deck.id" :value="deck.id">
				<AccordionTrigger class="items-center" :class="{ 'text-muted-foreground': !deck.useable.useable }">
					<component class="grow-2 basis-0" :is="deck.descComp" />
					<CardCount :phenomena="phenomena" :counts="deck.counts" />
					<div class="basis-0 grow-1 flex justify-end items-center gap-2 pr-2">
						<TooltipProvider v-if="!deck.useable.useable">
							<Tooltip>
								<TooltipTrigger>
									<TriangleAlert />
								</TooltipTrigger>
								<TooltipContent>
									<p v-for="issue in deck.useable.issues">{{ issue }}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<div class="flex items-center gap-2">
							<DeckMenu 
								:list="deck" 
								:specs="{ minCards, maxCards, minPlanes, phenomena }"
								:useable="deck.useable.useable"
								@use="emit('use', deck)"
							/>
						</div>
					</div>  
				</AccordionTrigger>
				<AccordionContent>
					<CardTable :phenomena="phenomena" :cards="deck.cards" />
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	</div>
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
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDecks } from "@/store";
import { CardCount, CardTable, DeckMenu } from "../controls";
import { buildDesc, isDeckListUseable, type Props } from "../utils";

const tab = defineModel();
const specs = defineProps<Props>();
const emit = defineEmits(["use", "build"]);

const decksStore = useDecks();

const decks = computed(() =>
	[...decksStore.decks.values()].map((d) => ({
		...d,
		descComp: buildDesc(d),
		useable: isDeckListUseable(d, specs),
	})),
);
</script>
