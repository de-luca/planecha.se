import { State } from "./MapState";

export enum RevealerMode {
  SCRY = 'SCRY',
  SHOW = 'SHOW',
  PICK = 'PICK',
}

export enum RevealerSource {
  ARETOPOLIS = 'ARETOPOLIS',
  CHAOTIC_AETHER = 'CHAOTIC_AETHER',
  POOL_OF_BECOMING = 'POOL_OF_BECOMING',
  STAIRS_TO_INFINITY = 'STAIRS_TO_INFINITY',
  INTERPLANAR_TUNNEL = 'INTERPLANAR_TUNNEL',
  SPACIAL_MERGING = 'SPACIAL_MERGING',
}

export interface Revealer extends State {
  source: RevealerSource;
  component: RevealerMode;
  sendShownTo: 'top' | 'bottom';
  initiator?: string;
  title?: string;
}
