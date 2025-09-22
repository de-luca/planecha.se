import { defineStore } from "pinia";
import { ref } from "vue";
import type { SavedDeck } from "../types/index";

type DecksState = Map<string, SavedDeck>;

export const useDecks = defineStore("decks", () => {
	const serializedDecks = localStorage.getItem("decks");
	const decks = ref<DecksState>(
		serializedDecks !== null
			? new Map(JSON.parse(serializedDecks) as Array<[string, SavedDeck]>)
			: new Map(),
	);

	const saveDecks = () =>
		localStorage.setItem(
			"decks",
			JSON.stringify(Array.from(decks.value.entries())),
		);

	const addDeck = (name: string, deck: SavedDeck) => {
		decks.value.set(name, deck);
		saveDecks();
	};

	const removeDeck = (name: string) => {
		decks.value.delete(name);
		saveDecks();
	};

	return { decks, addDeck, removeDeck };
});
