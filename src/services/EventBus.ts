import mitt from 'mitt';

export enum EventType {
  // CARDS EVENTS
  ARETOPOLIS = 'ARETOPOLIS',
  CHAOTIC_AETHER = 'CHAOTIC_AETHER',
  POOL_OF_BECOMING = 'POOL_OF_BECOMING',
  STAIRS_TO_INFINITY = 'STAIRS_TO_INFINITY',
  INTERPLANAR_TUNNEL = 'INTERPLANAR_TUNNEL',
  SPACIAL_MERGING = 'SPACIAL_MERGING',

  // ONLINE EVENTS
  BYE = 'BYE',

  // NOTIF EVENTS
  NOTIF = 'NOTIF',
}

export interface ByeEventPayload {
  initiator: string;
}

export interface NotifEventPayload {
  text: string;
  className: string;
}

type Emits<EventType, T> = {
  on(type: EventType, handler: (arg: T) => void): void;
  off(type: '*', handler?: (arg: T) => void): void;
  off(type: EventType, handler: (arg: T) => void): void;
  emit(type: EventType, arg?: T): void;
};

type Emitter =
    Emits<EventType.BYE, ByeEventPayload>
  & Emits<EventType.NOTIF, NotifEventPayload>
  & Emits<EventType, undefined>;

export const eventBus: Emitter = mitt();
