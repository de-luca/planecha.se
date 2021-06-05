import { MutationTypes, useStore } from "@/store";
import { LogType } from "@/store/states/map";

export enum Event {
    REQUEST_INIT = 'request_init',
    HEY = 'hey',
    INIT = 'init',
    CHAOS = 'chaos',
    PLANESWALK = 'planeswalk',
}

export type Payload<T> = {
    event: Event,
    data: T,
}

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

            case Event.CHAOS:
                store.commit(MutationTypes.CHAOS);
                store.commit(MutationTypes.LOG, {
                    initiator: store.getters.mates.get(this.label) as string,
                    type: LogType.CHAOS,
                });
                break;

            case Event.PLANESWALK:
                store.commit(MutationTypes.PLANESWALK);
                store.commit(MutationTypes.LOG, {
                    initiator: store.getters.mates.get(this.label) as string,
                    ...store.getters.map.getLog(),
                });
                break;

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