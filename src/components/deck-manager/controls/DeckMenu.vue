<template>
	<div class="flex items-center gap-2">
		<Star v-if="favorite" class="text-yellow-500" />
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
		<div>
			<Button 
				size="sm" 
				class="h-7" 
				:disabled="!useable"
				@click.prevent.stop="emit('use')"
			>
				Use
			</Button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Menu, Star } from "lucide-vue-next";
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
import {
	DeckBuilderActionOutput,
	DeckNameActionOutput,
	useDecks,
	useUI,
} from "@/store";
import { Custom, List, Precon } from "@/types";
import { Props } from "../utils";

const emit = defineEmits(["use"]);
const {
	list,
	specs,
	useable,
	ro = false,
} = defineProps<{
	list: Precon | List | Custom;
	specs: Props;
	useable: boolean;
	ro?: boolean;
}>();

const {
	openConfirm,
	closeConfirm,
	openDeckName,
	closeDeckName,
	openDeckBuilder,
	closeDeckBuilder,
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
				cards,
				name,
				desc,
				counts,
			});
			closeDeckName();
			closeDeckBuilder();
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
		specs,
		description: `New deck from ${list.name}`,
		cards: list.cards,
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
					saveDeck("Save and use deck", deckBuilderOutput, false, () =>
						emit("use"),
					),
			},
			{
				name: "Use deck without saving",
				onlyValid: true,
				action: () => emit("use"),
			},
		],
	});

const duplicate = () =>
	decks.addDeck({
		id: crypto.randomUUID(),
		name: `Copy of ${list.name}`,
		desc: "desc" in list ? list.desc : undefined,
		cards: list.cards,
		counts: list.counts,
	});

const edit = () =>
	openDeckBuilder({
		specs,
		description: `Editing deck ${list.name}`,
		cards: list.cards,
		actions: [
			{
				name: "Save deck",
				default: true,
				action: (deckBuilderOutput) =>
					saveDeck("Save deck", deckBuilderOutput, true),
			},
		],
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