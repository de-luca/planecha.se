import type { TriggerConfig } from "../map/eternities";
import type { Wall } from "./Wall";

export interface EncounterWall extends Wall {
	coords: Coordinates;
	triggerConfig: TriggerConfig;
}
