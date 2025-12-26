import type { Card } from "@/model/card";

export type Counts = {
	cards: number;
	planes: number;
	phenomena: number;
};

export type BaseList = {
	id: string;
	name: string;
	cards: Array<Card>;
	counts: Counts;
};

export type Custom = BaseList & {
	desc?: string;
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
	default?: boolean;
	desc: string;
	filters: {
		sets: Array<string>;
	};
};
