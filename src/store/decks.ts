import { defineStore } from "pinia";
import { ref } from "vue";
import type { SavedDeck } from "@/types";

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

	const serializedFavorites = localStorage.getItem("favorites");
	const favorites = ref<Set<string>>(
		serializedFavorites !== null
			? new Set(JSON.parse(serializedFavorites) as Array<string>)
			: new Set(),
	);
	const saveFavorites = () =>
		localStorage.setItem(
			"favorites",
			JSON.stringify(Array.from(favorites.value.values())),
		);

	const addDeck = (deck: SavedDeck) => {
		decks.value.set(deck.id, deck);
		saveDecks();
	};

	const favoriteDeck = (id: string) => {
		favorites.value.add(id);
		saveFavorites();
	};

	const unfavoriteDeck = (id: string) => {
		favorites.value.delete(id);
		saveFavorites();
	};

	const renameDeck = (id: string, name: string, desc?: string) => {
		decks.value.set(id, {
			...decks.value.get(id)!,
			name,
			desc,
		});
		saveDecks();
	};

	const removeDeck = (id: string) => {
		decks.value.delete(id);
		saveDecks();
	};

	return {
		decks,
		favorites,
		addDeck,
		favoriteDeck,
		unfavoriteDeck,
		renameDeck,
		removeDeck,
	};
});
