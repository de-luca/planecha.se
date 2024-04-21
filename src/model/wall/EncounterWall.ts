import type { TriggerConfig } from "../game/eternities";
import type { Wall } from "./Wall";

export interface EncounterWall extends Wall {
	coords: Coordinates;
	triggerConfig: TriggerConfig;
}
