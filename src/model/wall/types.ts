import type { Coordinates } from "@/types";
import type { TriggerConfig } from "../game/eternities";

export enum RevealerMode {
	SCRY = 0,
	SHOW = 1,
	PICK = 2,
}

export enum RevealerSource {
	CUSTOM = 0,
	NORNS_SEEDCORE = 1,
	POOLS_OF_BECOMING = 2,
	STAIRS_TO_INFINITY = 3,
	THE_FERTILE_LANDS_OF_SAULVINIA = 4,
	INTERPLANAR_TUNNEL = 5,
	SPACIAL_MERGING = 6,
}

export type Wall = { initiator: string };

export type PhenomenonWall = Wall;

export type EncounterWall = Wall & {
	coords: Coordinates;
	triggerConfig: TriggerConfig;
};

export type RevealerWall = Wall & {
	source: RevealerSource;
	component: RevealerMode;
	sendShownTo: "top" | "bottom";

	tagline?: string;
	title?: string;
	subTitle?: string;
};
