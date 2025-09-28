import type { Card as CardModel } from "@/model/card";

export type Board = {
	yours: boolean;
	mate: string;
	active: Array<CardModel>;
	started: boolean;
};
