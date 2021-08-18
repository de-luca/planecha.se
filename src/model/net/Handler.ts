import { MutationTypes, useStore } from '@/store';
import { Card, Phenomenon, Plane } from '../card';
import { Coordinates, Exported } from '../map/MapInterface';
import { State, StateKey, StateOp } from '../state/MapState';

export enum Event {
  REQUEST_INIT = 'REQUEST_INIT',
  HEY = 'HEY',
  INIT = 'INIT',
  CHAOS = 'CHAOS',
  PLANESWALK = 'PLANESWALK',
  CUSTOM_PLANESWALK = 'CUSTOM_PLANESWALK',
  PLANESWALK_FROM_PHENOMENON = 'PLANESWALK_FROM_PHENOMENON',
  ENCOUNTER = 'ENCOUNTER',
  COUNTERS = 'COUNTERS',
  REVEAL = 'REVEAL',
  RESOLVE_REVEAL = 'RESOLVE_REVEAL',
  SHUFFLE = 'SHUFFLE',
  START_ETERNITIES = 'START_ETERNITIES',
  UPDATE_STATE = 'UPDATE_STATE',
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
      case Event.REQUEST_INIT: {
        this.send(stringify(Event.INIT, store.getters.map.export()));
        break;
      }

      case Event.SHUFFLE: {
        store.commit(MutationTypes.SHUFFLE, payload.data as Exported);
        break;
      }

      case Event.CHAOS: {
        store.commit(MutationTypes.CHAOS, {
          passivity: { passive: true, initiator: this.label },
        });
        break;
      }

      case Event.PLANESWALK_FROM_PHENOMENON: {
        store.commit(MutationTypes.PLANESWALK_FROM_PHENOMENON, {
          passivity: { passive: true, initiator: this.label },
        });
        break;
      }

      case Event.ENCOUNTER: {
        const data = payload.data as { coordinates: Coordinates };
        store.commit(MutationTypes.ENCOUNTER, {
          coordinates: data.coordinates,
          passivity: { passive: true, initiator: this.label },
        });
        break;
      }

      case Event.PLANESWALK:{
        const data = payload.data as { coordinates?: Coordinates };
        store.commit(MutationTypes.PLANESWALK, {
          coordinates: data.coordinates,
          passivity: { passive: true, initiator: this.label },
        });
        break;
      }

      case Event.CUSTOM_PLANESWALK: {
        const data = payload.data as { planes: Array<string> };
        const allCards = Array<Card>().concat(
          store.getters.revealed?.relevant ?? [],
          store.getters.revealed?.others ?? [],
        );

        store.commit(MutationTypes.CUSTOM_PLANESWALK, {
          planes: data.planes.map((id) => allCards.find(c => c.id === id) as Plane),
        });
        break;
      }

      case Event.COUNTERS: {
        store.commit(MutationTypes.COUNTERS, {
          ...payload.data as { id: string, change: number },
          initiator: this.label,
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
          initiator: this.label,
        });
        break;
      }

      case Event.UPDATE_STATE: {
        const data = payload.data as { key: StateKey, op: StateOp, val?: State };
        store.commit(MutationTypes.UPDATE_STATE, data);
        break;
      }

      case Event.START_ETERNITIES: {
        store.commit(MutationTypes.START_ETERNITIES);
        break;
      }

      case Event.HEY: {
        if (!store.getters.mates.get(this.label)) {
          store.commit(MutationTypes.HEY, {
            id: this.label,
            name: (payload.data as { name: string }).name,
          });
          this.send(stringify(Event.HEY, { name: myName }));
        }
        break;
      }
    }
  };
}
