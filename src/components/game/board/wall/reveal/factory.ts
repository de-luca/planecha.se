import type { Component } from "vue";

import { RevealerMode } from "#/model/wall";
import Pick from "./Pick.vue";
import Scry from "./Scry.vue";
import Show from "./Show.vue";

const map: Record<RevealerMode, Component> = {
	[RevealerMode.SCRY]: Scry,
	[RevealerMode.SHOW]: Show,
	[RevealerMode.PICK]: Pick,
};

export const getRevealer = (mode: RevealerMode): Component => map[mode];
