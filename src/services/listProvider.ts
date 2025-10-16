import rawLists from "#assets/lists.json";
import type { List } from "@/types";
import { getCardByFilter } from "./cardProvider";

const buildList = (list: (typeof rawLists)[0]): List => {
	const counts = {
		cards: 0,
		planes: 0,
		phenomena: 0,
	};

	return {
		...list,
		cards: getCardByFilter(list.filters).map((c) => {
			counts.cards++;
			c.type === "Plane" ? counts.planes++ : counts.phenomena++;
			return c;
		}),
		counts: counts,
	};
};

const defaultList: List = buildList(rawLists.find((r) => r.default)!);
const lists: Array<List> = rawLists.map(buildList);

export const getDefaultList = (): List => defaultList;
export const getLists = (): Array<List> => lists;
