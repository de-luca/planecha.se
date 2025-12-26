import { defineStore, type Store } from "pinia";
import { ref } from "vue";
import { getCardByFilter, getCardList } from "@/services/cardProvider";
import type { Custom, List, Precon } from "@/types";

export type SavedDeck = Omit<Custom, "cards"> & {
	cards: Array<string>;
};

type DecksState = Map<string, Custom>;
type ListsState = Map<string, List>;
type PreconsState = Map<string, Precon>;

export const isDeck = (store: Store): store is ReturnType<typeof useDecks> =>
	store.$id === "decks";

export const useDecks = defineStore("decks", () => {
	// #region Favorites
	const rawFavorites = localStorage.getItem("favorites");
	const favorites = ref<Set<string>>(
		rawFavorites !== null
			? new Set(JSON.parse(rawFavorites) as Array<string>)
			: new Set(),
	);

	const favoriteDeck = (id: string) => favorites.value.add(id);
	const unfavoriteDeck = (id: string) => favorites.value.delete(id);
	// #endregion

	// #region Custon Decks
	const buildCustom = (raw: SavedDeck) => ({
		...raw,
		cards: getCardList(raw.cards),
	});

	const rawDecks = localStorage.getItem("decks");
	const decks = ref<DecksState>(
		rawDecks !== null
			? new Map(
					(JSON.parse(rawDecks) as Array<[string, SavedDeck]>).map(
						([id, raw]) => [id, buildCustom(raw)],
					),
				)
			: new Map(),
	);

	const addDeck = (deck: Custom) => decks.value.set(deck.id, deck);
	const renameDeck = (id: string, name: string, desc?: string) =>
		decks.value.set(id, {
			...decks.value.get(id)!,
			name,
			desc,
		});
	const removeDeck = (id: string) => {
		unfavoriteDeck(id);
		decks.value.delete(id);
	};
	// #endregion

	// #region Precons
	const precons = ref<PreconsState>(new Map());
	(async () => {
		for (const precon of (await import("#assets/precons.json")).default) {
			precons.value.set(precon.id, {
				...precon,
				cards: getCardList(precon.cards),
			});
		}
	})();
	// #endregion

	// #region Lists
	const lists = ref<ListsState>(new Map());
	const defaultList = ref<List>();
	(async () => {
		for (const list of (await import("#assets/lists.json")).default) {
			const counts = {
				cards: 0,
				planes: 0,
				phenomena: 0,
			};

			lists.value.set(list.id, {
				...list,
				cards: getCardByFilter(list.filters).map((c) => {
					counts.cards++;
					c.type === "Plane" ? counts.planes++ : counts.phenomena++;
					return c;
				}),
				counts: counts,
			});
		}

		defaultList.value = [...lists.value.values()].find((l) => l.default);
	})();
	// #endregion

	return {
		precons,
		lists,
		defaultList,
		decks,
		favorites,
		addDeck,
		favoriteDeck,
		unfavoriteDeck,
		renameDeck,
		removeDeck,
	};
});
