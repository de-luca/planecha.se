<template>
	<Dialog :open="isOpen" @update:open="isOpen = $event">
		<DialogTrigger as-child>
			<Card class="hover:bg-accent hover:text-accent-foreground hover:cursor-pointer" title="Open Deck Manager">
				<CardHeader v-if="usedDeck" class="flex justify-between">
					<component :is="toDeckList(usedDeck).component" />
					<CardCount class="text-muted-foreground text-sm" :phenomena="phenomena" :counts="usedDeck.counts" />
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
			<DialogHeader v-else>
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
import { computed, KeepAlive, ref } from "vue";
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
import { CustomList, DeckBuilder, ListList, PreconList } from "./tabs";
import {
	type AnyDeck,
	type DeckList,
	isDeckListUseable,
	type Props,
	toDeckList,
} from "./utils";

const { openDeckBuilder, openDeckName, closeDeckBuilder, closeDeckName } =
	useUI();
const decks = useDecks();

const DEFAULT_TAB = "custom";

const specs = defineProps<Props>();
const emit = defineEmits(["use"]);

const isOpen = ref(false);
const tab = ref(DEFAULT_TAB);
const deck = ref<BaseList>();

const cleanList = (list?: BaseList): BaseList | undefined =>
	!list
		? list
		: specs.phenomena
			? list
			: {
					...list,
					cards: list.cards.filter((c) => !(c instanceof Phenomenon)),
				};

const usedDeck = computed(() => {
	const value = deck.value ?? prefilledDeck.value;
	emit("use", cleanList(value));
	return value;
});

const prefilledDeck = computed(() => {
	const favorites = [...decks.favorites.values()];

	const found = [
		...favorites.map((id) => decks.decks.get(id)),
		...favorites.map((id) => decks.lists.get(id)),
		...favorites.map((id) => decks.precons.get(id)),
		decks.defaultList,
	].filter(Boolean);

	return found.find((deck) => isDeckListUseable(deck!, specs).useable);
});

const useDeckList = (list: AnyDeck) => {
	deck.value = list;
	isOpen.value = false;
	tab.value = DEFAULT_TAB;
};

const saveDeck = (
	actionLabel: string,
	builderOutput: DeckBuilderActionOutput,
	fn: (input: DeckNameActionOutput & { id: string }) => void = () => {},
) => {
	const id = crypto.randomUUID();

	openDeckName({
		title: "Save Deck",
		description: "Give your deck a distintive name.",
		deckName: undefined,
		deckDesc: undefined,
		actionLabel: actionLabel,
		onAction: (nameOutput) => {
			decks.addDeck({ id, ...nameOutput, ...builderOutput });
			closeDeckName();
			closeDeckBuilder();
			toast("Deck saved");
			fn({ id, ...nameOutput });
		},
	});
};

const openBuilder = () =>
	openDeckBuilder({
		specs,
		description: "Create your own planar decks.",
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
						useDeckList({
							...deckNameOutput,
							...deckBuilderOutput,
						}),
					),
			},
			{
				name: "Use deck without saving",
				onlyValid: true,
				action: (deckBuilderOutput) =>
					useDeckList({
						id: "",
						name: "Custom deck",
						...deckBuilderOutput,
					}),
			},
		],
	});
</script>
