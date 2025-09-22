import type { Card } from "@/model/card";

export type Counts = {
	cards: number;
	planes: number;
	phenomena: number;
};

export type BaseList = {
	name: string;
	cards: Array<Card>;
	counts: Counts;
};

export type Precon = BaseList & {
	identity?: Array<string>;
	face?: Array<string>;
	set: {
		name: string;
		code: string;
		year: number;
	};
};

export type List = BaseList & {
	desc: string;
	filters: {
		sets: Array<string>;
	};
};

export type SavedDeck = {
	name: string;
	desc?: string;
	cards: Array<string>;
	counts: Counts;
};
