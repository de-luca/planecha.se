import raw from "#assets/cards.json";
import { build, type Card, type Props } from "@/model/card";

const cards: Map<string, Card> = (raw as Array<Props>).reduce(
	(acc, p) => acc.set(p.id, build(p)),
	new Map<string, Card>(),
);

export const getCard = <T extends Card>(id: string): T => cards.get(id) as T;

export const getAllCards = () => cards.values();

export const getCardList = <T extends Card>(list: Array<string>): Array<T> =>
	list.map((item) => getCard<T>(item));

export const getCardByFilter = (filters: { sets: Array<string> }) =>
	cards.values().filter((r) => filters.sets.some((s) => r.sets.includes(s)));
