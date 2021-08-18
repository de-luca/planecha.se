import { TriggerConfig } from "../map";
import { MapState } from "./MapStates";

export interface EncounterWallState extends MapState {
  coordinates: Coordinates
  triggerConfig: TriggerConfig,
}
