import { WallState } from './WallStates';
import { TriggerConfig } from '../map/eternities';

export interface EncounterWallState extends WallState {
  coords: Coordinates
  triggerConfig: TriggerConfig,
}
