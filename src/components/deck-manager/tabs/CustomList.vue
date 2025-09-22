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
        <Button variant="default" @click="tab = 'builder'">
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
      <AccordionItem v-for="deck in decks" :key="deck.name" :value="deck.name">
        <AccordionTrigger class="items-center" :class="{ 'text-muted-foreground': !deck.useable.useable }">
          <component class="grow-2 basis-0" :is="buildDesc(deck)" />
          <CardCount :phenomena="phenomena" :counts="deck.counts" />
          <div class="basis-0 grow-1 flex justify-end items-center gap-3 pr-3">
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

            <Button variant="destructive" size="sm" class="h-7 mr-2" @click.prevent.stop="remove(deck.name)">
              Delete
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              class="h-7" 
              :disabled="!deck.useable.useable"
              @click.prevent.stop="$emit('use', toDeckList(deck))"
            >
              Use
            </Button>
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
import { toast } from "vue-sonner";

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

import { CardCount, CardTable } from "../controls";

import { useDecks } from "@/store/decks";
import { useUI } from "@/store/ui";

import type { Card } from "@/model/card";
import { getCardList } from "@/services/cardProvider";
import type { SavedDeck } from "@/types/index";
import { type DeckList, type Props, isDeckListUseable } from "../utils";

type Deck = Omit<SavedDeck, "cards"> & { cards: Array<Card> };

const tab = defineModel();
const { minCards, maxCards, minPlanes, phenomena } = defineProps<Props>();
const emit = defineEmits(["use"]);

const decksStore = useDecks();
const confirm = useUI().confirm;

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

const remove = (name: string) => {
	confirm.title = "Remove deck";
	confirm.description = h("div", [
		h("p", ['You are about to delete the deck "', h("strong", name), '".']),
		h("p", "This cannot be undone."),
	]);
	confirm.cancelLabel = "Cancel";
	confirm.actionLabel = "Remove";
	confirm.onCancel = () => {
		confirm.open = false;
	};
	confirm.onAction = () => {
		decksStore.removeDeck(name);
		confirm.open = false;
		toast("Deck removed");
	};
	confirm.open = true;
};

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

// @Component({
// 	emits: ["use", "builder", "presets"],
// 	components: { CardList },
// })
// export default class CustomList extends Vue {
// 	@Prop({ required: true })
// 	public reqs: DeckReqs;

// 	private store = useMain();

// 	public search = "";
// 	public opened = "";

// 	public get decks(): Map<string, SavedDeck> {
// 		return new Map(
// 			[...this.store.decks].filter(([k]) =>
// 				k.toLowerCase().includes(this.search),
// 			),
// 		);
// 	}

// 	public get kind(): DeckKind {
// 		return this.reqs.mapType === GameType.ETERNITIES &&
// 			this.reqs.deckType === EternitiesMapDeckType.PLANES
// 			? "planes"
// 			: "all";
// 	}

// 	public canUse(deck: SavedDeck): boolean {
// 		if (this.kind !== "all" && deck.kind !== this.kind) {
// 			return false;
// 		}

// 		const req = REQUIREMENTS[this.reqs.mapType];
// 		return Object.entries(req).every(([k, r]) => {
// 			return (
// 				deck.counts[k as CardType] >= r.min &&
// 				deck.counts[k as CardType] <= (r.max ?? Number.POSITIVE_INFINITY)
// 			);
// 		});
// 	}

// 	public getTag(kind: DeckKind): string {
// 		return KIND_MAP[kind];
// 	}

// 	public toggleDetails(name: string): void {
// 		this.opened = this.opened === name ? "" : name;
// 	}

// 	public remove(name: string): void {
// 		this.store.removeDeck(name);
// 	}
// }
</script>
