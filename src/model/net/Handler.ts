import * as ActPayload from './payloads';
import { MutationTypes, useStore } from '@/store';
import { Card, Phenomenon, Plane } from '../card';
import { Exported } from '../map';

export enum Event {
  REQUEST_INIT = 'REQUEST_INIT',
  HEY = 'HEY',
  INIT = 'INIT',
  CHAOS = 'CHAOS',
  PLANESWALK = 'PLANESWALK',
  CUSTOM_PLANESWALK = 'CUSTOM_PLANESWALK',
  ENCOUNTER = 'ENCOUNTER',
  RESOLVE = 'RESOLVE',
  COUNTERS = 'COUNTERS',
  REVEAL = 'REVEAL',
  RESOLVE_REVEAL = 'RESOLVE_REVEAL',
  SHUFFLE = 'SHUFFLE',
  START_GAME = 'START_GAME',
  UPDATE_STATE = 'UPDATE_STATE',
}

export interface Payload<T> {
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

export function getHandler(
  myName: string,
): (this: RTCDataChannel, event: MessageEvent<string>) => any {
  const store = useStore();

  return function(this: RTCDataChannel, event: MessageEvent<string>) {
    const payload = parse(event.data);
    const passivity: Passivity = { passive: true, initiator: this.label };

    switch (payload.event) {
      case Event.REQUEST_INIT: {
        this.send(stringify(Event.INIT, store.getters.map.export()));
        break;
      }

      case Event.SHUFFLE: {
        const data = payload.data as Exported;
        store.commit(MutationTypes.SHUFFLE, data);
        break;
      }

      case Event.CHAOS: {
        store.commit(MutationTypes.CHAOS, { passivity });
        break;
      }

      case Event.RESOLVE: {
        store.commit(MutationTypes.RESOLVE, { passivity });
        break;
      }

      case Event.ENCOUNTER: {
        const data = payload.data as ActPayload.Encounter;
        store.commit(MutationTypes.ENCOUNTER, { ...data, passivity });
        break;
      }

      case Event.PLANESWALK:{
        const data = payload.data as ActPayload.Planeswalk;
        store.commit(MutationTypes.PLANESWALK, { ...data, passivity });
        break;
      }

      case Event.CUSTOM_PLANESWALK: {
        const data = payload.data as ActPayload.CustomPlaneswalkWire;
        const allCards = Array<Card>().concat(
          store.getters.revealed?.relevant ?? [],
          store.getters.revealed?.others ?? [],
        );

        store.commit(MutationTypes.CUSTOM_PLANESWALK, {
          planes: data.planes.map(id => allCards.find(c => c.id === id) as Plane),
        });
        break;
      }

      case Event.COUNTERS: {
        const data = payload.data as ActPayload.Counters;
        store.commit(MutationTypes.COUNTERS, { ...data, initiator: this.label });
        break;
      }

      case Event.REVEAL: {
        const data = payload.data as ActPayload.RevealWire;
        store.commit(MutationTypes.REVEAL, {
          count: data.count,
          type: data.type ? cardTypeMap[data.type] : undefined,
        });
        break;
      }

      case Event.RESOLVE_REVEAL: {
        const data = payload.data as ActPayload.ResolveRevealWire;
        const allCards = Array<Card>().concat(
          store.getters.revealed?.relevant ?? [],
          store.getters.revealed?.others ?? [],
        );

        store.commit(MutationTypes.RESOLVE_REVEAL, {
          top: data.top.map((id) => allCards.find(c => c.id === id) as Card),
          bottom: data.bottom.map((id) => allCards.find(c => c.id === id) as Card),
          initiator: this.label,
        });
        break;
      }

      case Event.UPDATE_STATE: {
        const data = payload.data as ActPayload.UpdateState;
        if (data.val) {
          data.val = { ...data.val, initiator: this.label };
        }
        store.commit(MutationTypes.UPDATE_STATE, data);
        break;
      }

      case Event.START_GAME: {
        store.commit(MutationTypes.START_GAME);
        break;
      }

      case Event.HEY: {
        if (!store.getters.mates.get(this.label)) {
          const data = payload.data as ActPayload.NameWire;
          store.commit(MutationTypes.HEY, { ...data, id: this.label });
          this.send(stringify(Event.HEY, { name: myName }));
        }
        break;
      }
    }
  };
}
