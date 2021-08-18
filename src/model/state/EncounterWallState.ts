import { Coordinates, TriggerConfig } from "../map";
import { State } from "./MapState";

export interface EncounterWallState extends State {
  coordinates: Coordinates
  triggerConfig: TriggerConfig,
}
