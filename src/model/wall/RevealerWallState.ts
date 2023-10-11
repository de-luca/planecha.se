import type { WallState } from './WallStates';

export enum RevealerMode {
  SCRY = 'SCRY',
  SHOW = 'SHOW',
  PICK = 'PICK',
}

export enum RevealerSource {
  CUSTOM = 'CUSTOM',
  ARETOPOLIS = 'ARETOPOLIS',
  CHAOTIC_AETHER = 'CHAOTIC_AETHER',
  POOLS_OF_BECOMING = 'POOLS_OF_BECOMING',
  STAIRS_TO_INFINITY = 'STAIRS_TO_INFINITY',
  NORNS_SEEDCORE = 'NORNS_SEEDCORE',
  THE_FERTILE_LANDS_OF_SAULVINIA = 'THE_FERTILE_LANDS_OF_SAULVINIA',
  INTERPLANAR_TUNNEL = 'INTERPLANAR_TUNNEL',
  SPACIAL_MERGING = 'SPACIAL_MERGING',
}

export interface RevealerWallState extends WallState {
  source: RevealerSource;
  component: RevealerMode;
  sendShownTo: 'top' | 'bottom';

  title?: string;
  subTitle?: string;
}
