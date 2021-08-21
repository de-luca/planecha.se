import { TriggerConfig } from "../map";
import { MapState } from "./MapStates";

export interface EncounterWallState extends MapState {
  coords: Coordinates
  triggerConfig: TriggerConfig,
}
