import decks from "#assets/precons.json";
import type { Precon } from "@/types";
import { getCardList } from "./cardProvider";

const buildPrecon = (precon: (typeof decks)[0]): Precon => ({
	...precon,
	cards: getCardList(precon.cards),
});

const precons = decks.map(buildPrecon);

export const getPrecons = (): Array<Precon> => precons;
