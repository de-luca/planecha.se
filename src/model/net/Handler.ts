import { MutationTypes, useStore } from "@/store";

export enum Event {
    REQUEST_INIT = 'request_init',
    INIT = 'init',
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

export function getHandler(): (this: RTCDataChannel, event: MessageEvent<string>) => any {
    const store = useStore();
    return function(this: RTCDataChannel, event: MessageEvent<string>) {
        const payload = parse(event.data);

        switch (payload.event) {
            case Event.REQUEST_INIT:
                this.send(stringify(Event.INIT, store.getters.map.export()));
                break;
            case Event.PLANESWALK:
                store.commit(MutationTypes.PLANESWALK);
                break;
            // case Event.INIT:
            //     map = Container.get(MapFactory).restore(payload.data as Exported)
            //     console.log(map);
            //     break;
        }

        // console.log(this);
        // console.log(event.data);
        // console.log(map.active);
    };
}