import { MutationTypes, useStore } from "@/store";
import { LogType } from "@/store/states/map";
import { Card, Phenomenon, Plane } from "../card";

export enum Event {
    REQUEST_INIT = 'request_init',
    HEY = 'hey',
    INIT = 'init',
    CHAOS = 'chaos',
    PLANESWALK = 'planeswalk',
    CUSTOM_PLANESWALK = 'custom_planeswalk',
    COUNTERS = 'counters',
    REVEAL = 'reveal',
    RESOLVE_REVEAL = 'resolve_reveal',
    SHUFFLE = 'shuffle',
}

export type Payload<T> = {
    event: Event,
    data: T,
}

const cardTypeMap: Record<string, typeof Card> = {
    'Card': Card,
    'Plane': Plane,
    'Phenomenon': Phenomenon,
};

export function parse<T>(payload: string): Payload<T> {
    return JSON.parse(payload) as Payload<T>;
}

export function stringify(event: Event, data: any = {}): string {
    return JSON.stringify({ event, data });
}

export function getHandler(myName: string): (this: RTCDataChannel, event: MessageEvent<string>) => any {
    const store = useStore();

    return function(this: RTCDataChannel, event: MessageEvent<string>) {
        const payload = parse(event.data);

        switch (payload.event) {
            case Event.REQUEST_INIT:
                this.send(stringify(Event.INIT, store.getters.map.export()));
                break;

            case Event.SHUFFLE:
                store.commit(
                    MutationTypes.SHUFFLE, 
                    payload.data as { active: Array<string>, deck: Array<string> },
                );
                break;

            case Event.CHAOS:
                store.commit(MutationTypes.CHAOS, { passive: true });
                store.commit(MutationTypes.LOG, {
                    initiator: store.getters.mates.get(this.label) as string,
                    type: LogType.CHAOS,
                });
                break;

            case Event.PLANESWALK:
                console.log('PLANESWALK');
                store.commit(MutationTypes.PLANESWALK, { passive: true });
                store.commit(MutationTypes.LOG, {
                    initiator: store.getters.mates.get(this.label) as string,
                    ...store.getters.map.getPlaneswalkLog(),
                });
                break;

            case Event.CUSTOM_PLANESWALK: {
                const data = payload.data as { planes: Array<string> };
                const allCards = Array<Card>().concat(
                    store.getters.revealed?.relevant ?? [],
                    store.getters.revealed?.others ?? [],
                );

                store.commit(MutationTypes.CUSTOM_PLANESWALK, {
                    planes: data.planes.map((id) => allCards.find(c => c.id === id) as Plane),
                    passive: true,
                });
                break;
            }

            case Event.COUNTERS: {
                const data = payload.data as { id: string, change: number };
                store.commit(MutationTypes.COUNTERS, data);                
                store.commit(MutationTypes.LOG, {
                    initiator: store.getters.mates.get(this.label) as string,
                    ...store.getters.map.getCounterLog(data.id, data.change),
                });
                break;
            }

            case Event.REVEAL: {
                const data = payload.data as { count: number, type?: string };
                store.commit(MutationTypes.REVEAL, {
                    count: data.count,
                    type: data.type ? cardTypeMap[data.type] : undefined,
                });
                break;
            }

            case Event.RESOLVE_REVEAL: {
                const data = payload.data as { top: Array<string>, bottom: Array<string> };
                const allCards = Array<Card>().concat(
                    store.getters.revealed?.relevant ?? [],
                    store.getters.revealed?.others ?? [],
                );

                store.commit(MutationTypes.RESOLVE_REVEAL, {
                    top: data.top.map((id) => allCards.find(c => c.id === id) as Card),
                    bottom: data.bottom.map((id) => allCards.find(c => c.id === id) as Card),
                });
                break;
            }

            case Event.HEY:
                if (!store.getters.mates.get(this.label)) {
                    store.commit(MutationTypes.HEY, {
                        id: this.label,
                        name: (payload.data as { name: string }).name,
                    });
                    store.commit(MutationTypes.LOG, {
                        initiator: store.getters.mates.get(this.label) as string,
                        type: LogType.JOIN,
                    });
                    this.send(stringify(Event.HEY, { name: myName }));
                }
                break;
        }
    };
}