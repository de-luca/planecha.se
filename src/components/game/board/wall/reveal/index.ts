import type { Component } from "vue";
import type { Card } from "@/model/card";
import type { RevealerWall } from "@/model/wall";

import { RevealerMode } from "@/model/wall";
import Pick from "./Pick.vue";
import Scry from "./Scry.vue";
import Show from "./Show.vue";

const map: Record<RevealerMode, Component> = {
	[RevealerMode.SCRY]: Scry,
	[RevealerMode.SHOW]: Show,
	[RevealerMode.PICK]: Pick,
};

export const getRevealer = (mode: RevealerMode) => map[mode];

export type PickedLeft = {
	picked: Array<Card>;
	left: Array<Card>;
};

export type RevealConfig = RevealerWall & {
	sendShownTo: "top" | "bottom";
	title?: string;
	subTitle?: string;
};
