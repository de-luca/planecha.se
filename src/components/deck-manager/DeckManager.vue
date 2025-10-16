<template>
	<Dialog :open="isOpen" @update:open="isOpen = $event">
		<DialogTrigger as-child>
			<Card class="hover:bg-accent hover:text-accent-foreground hover:cursor-pointer" title="Open Deck Manager">
				<CardHeader v-if="usedDeck" class="flex justify-between">
					<component :is="usedDeck.component" />
					<CardCount class="text-muted-foreground text-sm" :phenomena="phenomena" :counts="usedDeck.list.counts" />
				</CardHeader>
				<CardHeader v-else class="text-center text-muted-foreground">
					Pick a 10 cards deck
				</CardHeader>
			</Card>
		</DialogTrigger>

		<DialogContent class="sm:max-w-none w-[95vw] h-[95vh]">
			<DialogHeader v-if="tab === 'customs'">
				<DialogTitle>Your Decks</DialogTitle>
				<DialogDescription>
					Use and manage your planar decks.
				</DialogDescription>
			</DialogHeader>
			<DialogHeader v-else-if="tab === 'lists'">
				<DialogTitle>Quick Lists</DialogTitle>
				<DialogDescription>
					Use a currated list of cards with a common theme.
				</DialogDescription>
			</DialogHeader>
			<DialogHeader v-else-if="tab === 'precons'">
				<DialogTitle>Preconstructed Decks</DialogTitle>
				<DialogDescription>
					Use a planar deck from an existing MTG product.
				</DialogDescription>
			</DialogHeader>
			<Tabs default-value="single" class="w-full" v-model="tab">
				<div class="grid grid-cols-[3fr_1fr] items-center gap-2">
					<TabsList class="w-full grid grid-cols-3 h-10 px-2.5 min-w-10">
						<TabsTrigger class="dark:data-[state=active]:bg-unset" value="customs">
							Your Decks
						</TabsTrigger>
						<TabsTrigger class="dark:data-[state=active]:bg-unset" value="lists">
							Quick Lists
						</TabsTrigger>
						<TabsTrigger class="dark:data-[state=active]:bg-unset" value="precons">
							Preconstructed Decks
						</TabsTrigger>
						<!-- <TabsTrigger class="dark:data-[state=active]:bg-unset" value="builder">
							New Deck
						</TabsTrigger> -->
					</TabsList>
					<Button variant="outline" class="h-10" @click="openBuilder">New Deck</Button>
				</div>
				<TabsContent value="customs">
					<KeepAlive>
						<CustomList
							v-model="tab"
							:min-cards="minCards" 
							:max-cards="maxCards" 
							:min-planes="minPlanes" 
							:phenomena="phenomena" 
							@use="useDeckList"
							@build="openBuilder"
						/>
					</KeepAlive>
				</TabsContent>
				<TabsContent value="lists">
					<KeepAlive>
						<ListList 
							:min-cards="minCards" 
							:max-cards="maxCards" 
							:min-planes="minPlanes" 
							:phenomena="phenomena" 
							@use="useDeckList"
						/>
					</KeepAlive>
				</TabsContent>
				<TabsContent value="precons">
					<KeepAlive>
						<PreconList 
							:min-cards="minCards" 
							:max-cards="maxCards" 
							:min-planes="minPlanes" 
							:phenomena="phenomena" 
							@use="useDeckList"
						/>
					</KeepAlive>
				</TabsContent>
			</Tabs>
		</DialogContent>
	</Dialog>

	<DeckBuilder />
	<DeckName />
</template>

<script setup lang="ts">
import { computed, h, KeepAlive, ref } from "vue";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phenomenon } from "@/model/card";
import {
	DeckBuilderActionOutput,
	DeckNameActionOutput,
	useDecks,
	useUI,
} from "@/store";
import type { BaseList } from "@/types";
import { CardCount, DeckName } from "./controls";
import {
	CustomList,
	DEFAULT_LIST,
	DeckBuilder,
	ListList,
	PreconList,
} from "./tabs";
import type { DeckList, Props } from "./utils";

const { openDeckBuilder, openDeckName, closeDeckName } = useUI();
const decks = useDecks();

const DEFAULT_TAB = "custom";

const { minCards, maxCards, minPlanes, phenomena } = defineProps<Props>();
const emit = defineEmits(["use"]);

const isOpen = ref(false);
const tab = ref(DEFAULT_TAB);
const deck = ref<DeckList>();

const cleanList = (list?: BaseList): BaseList | undefined =>
	!list
		? list
		: phenomena
			? list
			: {
					...list,
					cards: list.cards.filter((c) => !(c instanceof Phenomenon)),
				};

const usedDeck = computed(() => {
	const value =
		deck.value ?? (minCards === 10 && maxCards === 10 ? null : DEFAULT_LIST);
	emit("use", cleanList(value?.list));
	return value;
});

const toDeckList = ({
	name,
	desc,
	cards,
	counts,
}: DeckNameActionOutput & DeckBuilderActionOutput): DeckList => ({
	list: { id: "", name, cards, counts },
	component: h("div", { class: "basis-1 grow" }, [
		h("div", { class: "flex" }, h("strong", name)),
		h("div", { class: "text-muted-foreground" }, desc),
	]),
});

const useDeckList = (list: DeckList) => {
	deck.value = list;
	isOpen.value = false;
	tab.value = DEFAULT_TAB;
};

const saveDeck = (
	actionLabel: string,
	{ cards, counts }: DeckBuilderActionOutput,
	fn: (input: DeckNameActionOutput) => void = () => {},
) =>
	openDeckName({
		title: "Save Deck",
		description: "Give your deck a distintive name.",
		deckName: undefined,
		deckDesc: undefined,
		actionLabel: actionLabel,
		onAction: ({ name, desc }) => {
			decks.addDeck({
				id: crypto.randomUUID(),
				cards: cards.map((c) => c.id),
				name,
				desc,
				counts,
			});
			closeDeckName();
			toast("Deck saved");
			fn({ name, desc });
		},
	});

const openBuilder = () =>
	openDeckBuilder({
		description: "Create your own planar decks.",
		specs: { minCards, maxCards, minPlanes, phenomena },
		actions: [
			{
				name: "Save deck",
				default: true,
				action: (deckBuilderOutput) => saveDeck("Save deck", deckBuilderOutput),
			},
			{
				name: "Save and use deck",
				onlyValid: true,
				action: (deckBuilderOutput) =>
					saveDeck("Save and use deck", deckBuilderOutput, (deckNameOutput) =>
						useDeckList(
							toDeckList({ ...deckNameOutput, ...deckBuilderOutput }),
						),
					),
			},
			{
				name: "Use deck without saving",
				onlyValid: true,
				action: (deckBuilderOutput) =>
					useDeckList(
						toDeckList({ ...deckBuilderOutput, name: "Custom deck" }),
					),
			},
		],
	});
</script>
