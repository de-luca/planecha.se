import { defineStore } from "pinia";
import { ref, type VNode } from "vue";
import type { Props } from "@/components/deck-manager/utils";
import type { Card } from "@/model/card";
import type { Counts } from "@/types";

export type DeckNameActionOutput = { name: string; desc?: string };
export type DeckBuilderActionOutput = { cards: Array<Card>; counts: Counts };

type ConfirmState = {
	open: boolean;
	title?: string;
	description?: VNode;
	cancelLabel?: string;
	actionLabel?: string;
	onAction: () => void;
	onCancel: () => void;
};

type PlayerNameState = {
	open: boolean;
	onAction: () => void;
};

type DeckNameState = {
	open: boolean;
	title?: string;
	description?: string;
	actionLabel?: string;

	deckName?: string;
	deckDesc?: string;

	onAction: (input: DeckNameActionOutput) => void;
};

type DeckBuilderAction = {
	name: string;
	default?: boolean;
	onlyValid?: boolean;
	action: (input: DeckBuilderActionOutput) => void;
};

type DeckBuilderState = {
	open: boolean;
	description?: string;
	specs?: Props;

	cards?: Array<string>;

	actions: Array<DeckBuilderAction>;
};

export const useUI = defineStore("ui", () => {
	const confirm = ref<ConfirmState>({
		open: false,
		onAction: () => {},
		onCancel: () => {},
	});

	const openConfirm = (props: Omit<ConfirmState, "open">) => {
		confirm.value.title = props.title;
		confirm.value.description = props.description;
		confirm.value.cancelLabel = props.cancelLabel;
		confirm.value.actionLabel = props.actionLabel;
		confirm.value.onAction = props.onAction;
		confirm.value.onCancel = props.onCancel;
		confirm.value.open = true;
	};

	const closeConfirm = () => {
		confirm.value.open = false;
	};

	const playerName = ref<PlayerNameState>({
		open: false,
		onAction: () => {},
	});

	const openPlayerName = (onAction: () => void = () => {}) => {
		playerName.value.onAction = onAction;
		playerName.value.open = true;
	};

	const closePlayerName = () => {
		playerName.value.open = false;
	};

	const deckName = ref<DeckNameState>({
		open: false,
		onAction: () => {},
	});

	const openDeckName = (props: Omit<DeckNameState, "open">) => {
		deckName.value.title = props.title;
		deckName.value.description = props.description;
		deckName.value.actionLabel = props.actionLabel;
		deckName.value.deckName = props.deckName;
		deckName.value.deckDesc = props.deckDesc;
		deckName.value.onAction = props.onAction;
		deckName.value.open = true;
	};

	const closeDeckName = () => {
		deckName.value.open = false;
	};

	const deckBuilder = ref<DeckBuilderState>({
		open: false,
		actions: [],
	});

	const openDeckBuilder = (props: Omit<DeckBuilderState, "open">) => {
		deckBuilder.value.description = props.description;
		deckBuilder.value.specs = props.specs;
		deckBuilder.value.cards = props.cards;
		deckBuilder.value.actions = props.actions;
		deckBuilder.value.open = true;
	};

	const closeDeckBuilder = () => {
		deckBuilder.value.open = false;
	};

	return {
		confirm,
		openConfirm,
		closeConfirm,
		playerName,
		openPlayerName,
		closePlayerName,
		deckName,
		openDeckName,
		closeDeckName,
		deckBuilder,
		openDeckBuilder,
		closeDeckBuilder,
	};
});
