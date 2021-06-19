import mitt, { Handler } from 'mitt';

export enum EventType {
    // CARDS EVENTS
    ARETOPOLIS = 'ARETOPOLIS',
    POOL_OF_BECOMING = 'POOL_OF_BECOMING',
    STAIRS_TO_INFINITY = 'STAIRS_TO_INFINITY',
    CHAOTIC_AETHER = 'CHAOTIC_AETHER',
    INTERPLANAR_TUNNEL = 'INTERPLANAR_TUNNEL',
    SPACIAL_MERGING = 'SPACIAL_MERGING',

    // GENERIC EVENTS
    RESOLVED_REVEAL = 'RESOLVED_REVEAL',

    // ONLINE EVENTS
    BYE = 'BYE',
}

export interface CardEventPayload {
    passive: boolean;
}

export interface ByeEventPayload {
    mateId: string;
}

type Emits<EventType, T> = {
    on(type: EventType, handler: (arg: T) => void): void;
    off(type: EventType, handler: (arg: T) => void): void;
    emit(type: EventType, arg?: T): void;
};

type Emitter = 
    Emits<EventType.RESOLVED_REVEAL, undefined> 
    & Emits<EventType.BYE, ByeEventPayload>
    & Emits<EventType, CardEventPayload>

export const eventBus: Emitter = mitt();