import mitt, { EventHandlerMap } from 'mitt';

export enum EventType {
  ARETOPOLIS = 'ARETOPOLIS',
  CHAOTIC_AETHER = 'CHAOTIC_AETHER',
  POOL_OF_BECOMING = 'POOL_OF_BECOMING',
  STAIRS_TO_INFINITY = 'STAIRS_TO_INFINITY',
  INTERPLANAR_TUNNEL = 'INTERPLANAR_TUNNEL',
  SPACIAL_MERGING = 'SPACIAL_MERGING',
}

type Emits<EventType, T> = {
  all: EventHandlerMap;
  on(type: EventType, handler: (arg: T) => void): void;
  off(type: EventType, handler: (arg: T) => void): void;
  emit(type: EventType, arg?: T): void;
};

type Emitter = Emits<EventType, undefined>;

export const eventBus: Emitter = mitt();
