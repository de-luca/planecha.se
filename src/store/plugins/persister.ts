import type { PiniaPluginContext } from "pinia";
import { toValue } from "vue";
import { isDeck } from "../decks";

export function persister({ store }: PiniaPluginContext) {
	if (isDeck(store)) {
		store.$subscribe((_, state) => {
			localStorage.setItem(
				"favorites",
				JSON.stringify(Array.from(toValue(state.favorites))),
			);
			localStorage.setItem(
				"decks",
				JSON.stringify(
					Array.from(toValue(state.decks).entries()).map(([id, deck]) => [
						id,
						{
							...deck,
							cards: deck.cards.map((c) => c.id),
						},
					]),
				),
			);
		});
	}
}
