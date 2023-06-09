import mitt from 'mitt';

export enum EventType {
  ARETOPOLIS = 'ARETOPOLIS',
  CHAOTIC_AETHER = 'CHAOTIC_AETHER',
  POOLS_OF_BECOMING = 'POOLS_OF_BECOMING',
  STAIRS_TO_INFINITY = 'STAIRS_TO_INFINITY',
  NORNS_SEEDCORE = 'NORNS_SEEDCORE',
  THE_FERTILE_LANDS_OF_SAULVINIA = 'THE_FERTILE_LANDS_OF_SAULVINIA',
  INTERPLANAR_TUNNEL = 'INTERPLANAR_TUNNEL',
  SPACIAL_MERGING = 'SPACIAL_MERGING',
}

type Events = Record<EventType, void>;

export const eventBus = mitt<Events>();
