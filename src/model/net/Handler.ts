import { Patch } from '../ver';
import { InitPayload, Payload, Event, Hey, Store } from './types';

export function parse<T>(payload: string): Payload<T> {
  return JSON.parse(payload) as Payload<T>;
}

export function stringify(event: Event, data: unknown = {}): string {
  return JSON.stringify({ event, data });
}

type Handler = (this: RTCDataChannel, event: MessageEvent<string>) => unknown;

export function getHandler(playerName: string, store: Store): Handler {
  return function(this: RTCDataChannel, event: MessageEvent<string>) {
    const payload = parse(event.data);

    switch (payload.event) {
      case Event.REQUEST_INIT: {
        const payload: InitPayload = {
          repo: store.repo.clone(),
          map: store.map.export(),
          feed: [ ...store.feed ],
        };
        this.send(stringify(Event.INIT, payload));
        break;
      }

      case Event.HEY: {
        if (!store.mates.get(this.label)) {
          const data = payload.data as Hey;
          store.hey({ ...data, id: this.label });
          this.send(stringify(Event.HEY, { name: playerName }));
        }
        break;
      }

      case Event.SYNC: {
        store.apply(payload.data as Patch);
        break;
      }

      case Event.REVERT: {
        store.applyRevert(payload.data as number);
        break;
      }

      case Event.FEED: {
        store.feed.push(payload.data as string);
        break;
      }
    }
  };
}
