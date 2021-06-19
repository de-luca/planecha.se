import mitt from 'mitt';

export enum Event {
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

export const eventBus = mitt();
