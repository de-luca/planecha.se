import mitt from 'mitt';

export enum EventType {
  ARETOPOLIS = 'ARETOPOLIS',
  CHAOTIC_AETHER = 'CHAOTIC_AETHER',
  POOL_OF_BECOMING = 'POOL_OF_BECOMING',
  STAIRS_TO_INFINITY = 'STAIRS_TO_INFINITY',
  INTERPLANAR_TUNNEL = 'INTERPLANAR_TUNNEL',
  SPACIAL_MERGING = 'SPACIAL_MERGING',
}

type Events = Record<EventType, void>;

export const eventBus = mitt<Events>();
