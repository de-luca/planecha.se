import type { Card } from "#/model/card";
import type { RevealerWall } from "#/model/wall";

export type PickedLeft = {
	picked: Array<Card>;
	left: Array<Card>;
};

export interface RevealConfig extends RevealerWall {
	sendShownTo: "top" | "bottom";
	title?: string;
	subTitle?: string;
}
