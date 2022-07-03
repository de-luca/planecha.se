import { Patch } from '../map';
import { useMain } from '@/store/main';

export enum Event {
  REQUEST_INIT = 'REQUEST_INIT',
  INIT = 'INIT',
  HEY = 'HEY',
  SYNC = 'SYNC',
}

export interface Hey {
  name: string;
}

export interface Payload<T> {
  event: Event,
  data: T,
}

export function parse<T>(payload: string): Payload<T> {
  return JSON.parse(payload) as Payload<T>;
}

export function stringify(event: Event, data: any = {}): string {
  return JSON.stringify({ event, data });
}

export function getHandler(
  myName: string,
): (this: RTCDataChannel, event: MessageEvent<string>) => any {
  const store = useMain();

  return function(this: RTCDataChannel, event: MessageEvent<string>) {
    const payload = parse(event.data);

    switch (payload.event) {
      case Event.REQUEST_INIT: {
        this.send(stringify(Event.INIT, store.map.export()));
        break;
      }

      case Event.HEY: {
        if (!store.mates.get(this.label)) {
          const data = payload.data as Hey;
          store.hey({ ...data, id: this.label });
          this.send(stringify(Event.HEY, { name: myName }));
        }
        break;
      }

      case Event.SYNC: {
        store.apply(payload.data as Patch);
        break;
      }
    }
  };
}
