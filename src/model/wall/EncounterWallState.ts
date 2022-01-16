import { TriggerConfig } from '../map';
import { WallState } from './WallStates';

export interface EncounterWallState extends WallState {
  coords: Coordinates
  triggerConfig: TriggerConfig,
}
