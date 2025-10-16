<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<Button 
				@click.prevent.stop variant="outline" 
				size="sm"
				class="h-7"
			>
				<Menu />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end" class="w-56">
			<DropdownMenuCheckboxItem @select.prevent v-model="favorite">
				Favorite
			</DropdownMenuCheckboxItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem @click="copyAsNew">Copy as new</DropdownMenuItem>
			<DropdownMenuItem v-if="!ro" @click="duplicate">Duplicate</DropdownMenuItem>
			<DropdownMenuItem v-if="!ro" @click="edit">Edit</DropdownMenuItem>
			<DropdownMenuItem v-if="!ro" @click="rename">Rename</DropdownMenuItem>
			<DropdownMenuItem v-if="!ro" @click="remove" variant="destructive">Delete</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>

<script setup lang="ts">
import { Menu } from "lucide-vue-next";
import { computed, h } from "vue";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/model/card";
import {
	DeckBuilderActionOutput,
	DeckNameActionOutput,
	useDecks,
	useUI,
} from "@/store";
import { List, Precon, SavedDeck } from "@/types";

const { list, ro = false } = defineProps<{
	list: Precon | List | SavedDeck;
	ro?: boolean;
}>();

const {
	openConfirm,
	closeConfirm,
	openDeckName,
	closeDeckName,
	openDeckBuilder,
} = useUI();
const decks = useDecks();

const saveDeck = (
	actionLabel: string,
	{ cards, counts }: DeckBuilderActionOutput,
	replace: boolean = false,
	fn: (input: DeckNameActionOutput) => void = () => {},
) =>
	openDeckName({
		title: "Save Deck",
		description: "Give your deck a distintive name.",
		deckName: replace ? list.name : undefined,
		deckDesc:
			replace && "desc" in list ? list.desc : `Original list: ${list.name}`,
		actionLabel: actionLabel,
		onAction: ({ name, desc }) => {
			decks.addDeck({
				id: replace ? list.id : crypto.randomUUID(),
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

const favorite = computed({
	get: () => decks.favorites.has(list.id),
	set: (value: boolean) =>
		value ? decks.favoriteDeck(list.id) : decks.unfavoriteDeck(list.id),
});

const copyAsNew = () =>
	openDeckBuilder({
		description: `New deck from ${list.name}`,
		cards: list.cards.map((c) => (c instanceof Card ? c.id : c)),
		actions: {
			"Save deck": (deckBuilderOutput) =>
				saveDeck("Save deck", deckBuilderOutput),
			"Save and use deck": () => {},
			"Use deck without saving": () => {},
		},
	});

const duplicate = () =>
	decks.addDeck({
		id: crypto.randomUUID(),
		name: `Copy of ${list.name}`,
		desc: "desc" in list ? list.desc : undefined,
		cards: list.cards.map((c) => (c instanceof Card ? c.id : c)),
		counts: list.counts,
	});

const edit = () =>
	openDeckBuilder({
		description: `Editing deck ${list.name}`,
		cards: list.cards.map((c) => (c instanceof Card ? c.id : c)),
		actions: {
			"Save deck": (deckBuilderOutput) =>
				saveDeck("Save deck", deckBuilderOutput, true),
		},
	});

const rename = () =>
	openDeckName({
		title: "Rename Deck",
		description: "Rename your deck.",
		actionLabel: "Rename",
		deckName: list.name,
		deckDesc: "desc" in list ? list.desc : undefined,
		onAction: ({ name, desc }) => {
			decks.renameDeck(list.id, name, desc);
			closeDeckName();
			toast("Deck renamed");
		},
	});

const remove = () =>
	openConfirm({
		title: "Remove deck",
		description: h("div", [
			h("p", [
				'You are about to delete the deck "',
				h("strong", list.name),
				'".',
			]),
			h("p", "This cannot be undone."),
		]),
		cancelLabel: "Cancel",
		actionLabel: "Remove",
		onCancel: closeConfirm,
		onAction: () => {
			decks.removeDeck(list.id);
			closeConfirm();
			toast("Deck removed");
		},
	});
</script>