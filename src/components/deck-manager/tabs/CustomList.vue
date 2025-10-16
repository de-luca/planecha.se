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
					<component class="grow-2 basis-0" :is="buildDesc(deck)" />
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
						<div>
							<DeckMenu :list="deck" />
						</div>
						<div>
							<!-- <Button 
								variant="destructive" 
								size="sm" 
								class="h-7 mr-2" 
								@click.prevent.stop="remove(deck.name)"
							>
								Delete
							</Button> -->
							<Button 
								size="sm" 
								class="h-7" 
								:disabled="!deck.useable.useable"
								@click.prevent.stop="$emit('use', toDeckList(deck))"
							>
								Use
							</Button>
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
import type { Card } from "@/model/card";
import { getCardList } from "@/services/cardProvider";
import { useDecks } from "@/store";
import type { SavedDeck } from "@/types";
import { CardCount, CardTable, DeckMenu } from "../controls";
import { type DeckList, isDeckListUseable, type Props } from "../utils";

type Deck = Omit<SavedDeck, "cards"> & { cards: Array<Card> };

const tab = defineModel();
const { minCards, maxCards, minPlanes, phenomena } = defineProps<Props>();
const emit = defineEmits(["use", "build"]);

const decksStore = useDecks();

const decks = computed(() =>
	[...decksStore.decks.values()]
		.map((d) => ({
			...d,
			cards: getCardList(d.cards),
		}))
		.map((d) => ({
			...d,
			useable: isDeckListUseable(d, {
				minCards,
				maxCards,
				minPlanes,
				phenomena,
			}),
		})),
);

const buildDesc = (deck: Deck) =>
	h("div", { class: "basis-1 grow" }, [
		h("div", { class: "flex" }, h("strong", deck.name)),
		h("div", { class: "text-muted-foreground" }, deck.desc),
	]);

const toDeckList = (deck: Deck): DeckList => {
	return {
		list: deck,
		component: buildDesc(deck),
	};
};
</script>
