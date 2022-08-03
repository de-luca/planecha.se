import type { TriggerConfig } from '../map/eternities';
import type { WallState } from './WallStates';

export interface EncounterWallState extends WallState {
  coords: Coordinates
  triggerConfig: TriggerConfig,
}
