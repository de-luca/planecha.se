import mitt from 'mitt';

export enum EventType {
  // CARDS EVENTS
  ARETOPOLIS = 'ARETOPOLIS',
  CHAOTIC_AETHER = 'CHAOTIC_AETHER',
  POOL_OF_BECOMING = 'POOL_OF_BECOMING',
  STAIRS_TO_INFINITY = 'STAIRS_TO_INFINITY',
  INTERPLANAR_TUNNEL = 'INTERPLANAR_TUNNEL',
  SPACIAL_MERGING = 'SPACIAL_MERGING',

  // GENERIC EVENTS
  RESOLVED_REVEAL = 'RESOLVED_REVEAL',

  // ONLINE EVENTS
  BYE = 'BYE',

  // NOTIF EVENTS
  NOTIF = 'NOTIF',
}

export interface CardEventPayload {
  passive: boolean;
  mateId?: string;
}

export interface ByeEventPayload {
  mateId: string;
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

type Emitter = Emits<EventType.RESOLVED_REVEAL, undefined>
  & Emits<EventType.BYE, ByeEventPayload>
  & Emits<EventType.NOTIF, NotifEventPayload>
  & Emits<EventType, CardEventPayload>;

export const eventBus: Emitter = mitt();
