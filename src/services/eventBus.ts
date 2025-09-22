import mitt from "mitt";

export enum EventType {
	CHAOTIC_AETHER = 0,
	POOLS_OF_BECOMING = 1,
	STAIRS_TO_INFINITY = 2,
	NORNS_SEEDCORE = 3,
	THE_FERTILE_LANDS_OF_SAULVINIA = 4,
	INTERPLANAR_TUNNEL = 5,
	SPACIAL_MERGING = 6,
}

type Events = Record<EventType, void>;

export const eventBus = mitt<Events>();
