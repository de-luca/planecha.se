import { MutationTypes, useStore } from '@/store';
import { Card, Phenomenon, Plane } from '../card';
import { Coordinates, Exported } from '../map/MapInterface';

export enum Event {
  REQUEST_INIT = 'REQUEST_INIT',
  HEY = 'HEY',
  INIT = 'INIT',
  CHAOS = 'CHAOS',
  PLANESWALK = 'PLANESWALK',
  CUSTOM_PLANESWALK = 'CUSTOM_PLANESWALK',
  COUNTERS = 'COUNTERS',
  REVEAL = 'REVEAL',
  RESOLVE_REVEAL = 'RESOLVE_REVEAL',
  SHUFFLE = 'SHUFFLE',
  START_ETERNITIES = 'START_ETERNITIES',
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
        store.commit(MutationTypes.CHAOS, { passive: true, mateId: this.label });
        break;
      }

      case Event.PLANESWALK:{
        const data = payload.data as { coordinates?: Coordinates };
        store.commit(MutationTypes.PLANESWALK, {
          coordinates: data.coordinates,
          passive: true,
          mateId: this.label,
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
          mateId: this.label,
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
          mateId: this.label,
        });
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