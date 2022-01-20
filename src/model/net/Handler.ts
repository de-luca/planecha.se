import * as ActPayload from './payloads';
import { Card, Phenomenon, Plane } from '../card';
import { Exported } from '../map';
import { useMain } from '@/store/main';

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
  UNDO = 'UNDO',
  SHUFFLE = 'SHUFFLE',
  START_GAME = 'START_GAME',
  UPDATE_WALL_STATE = 'UPDATE_WALL_STATE',
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
  const store = useMain();

  return function(this: RTCDataChannel, event: MessageEvent<string>) {
    const payload = parse(event.data);

    switch (payload.event) {
      case Event.REQUEST_INIT: {
        this.send(stringify(Event.INIT, store.map.export()));
        break;
      }

      case Event.UNDO: {
        const data = payload.data as ActPayload.Undo;
        store.undo({ ...data, initiator: this.label });
        break;
      }

      case Event.SHUFFLE: {
        const data = payload.data as Exported;
        store.shuffle(data);
        break;
      }

      case Event.CHAOS: {
        store.chaos({ initiator: this.label });
        break;
      }

      case Event.RESOLVE: {
        store.resolve({ initiator: this.label });
        break;
      }

      case Event.ENCOUNTER: {
        const data = payload.data as ActPayload.Encounter;
        store.encounter({ ...data, initiator: this.label });
        break;
      }

      case Event.PLANESWALK: {
        const data = payload.data as ActPayload.Planeswalk;
        store.planeswalk({ ...data, initiator: this.label });
        break;
      }

      case Event.CUSTOM_PLANESWALK: {
        const data = payload.data as ActPayload.CustomPlaneswalkWire;
        const allCards = Array<Card>().concat(
          store.map.revealed?.relevant ?? [],
          store.map.revealed?.others ?? [],
        );

        store.customPlaneswalk({
          planes: data.planes.map(id => allCards.find(c => c.id === id) as Plane),
          initiator: this.label,
        });
        break;
      }

      case Event.COUNTERS: {
        const data = payload.data as ActPayload.Counters;
        store.updateCounters({ ...data, initiator: this.label });
        break;
      }

      case Event.REVEAL: {
        const data = payload.data as ActPayload.RevealWire;
        store.reveal({
          count: data.count,
          type: data.type ? cardTypeMap[data.type] : undefined,
          initiator: this.label,
        });
        break;
      }

      case Event.RESOLVE_REVEAL: {
        const data = payload.data as ActPayload.ResolveRevealWire;
        const allCards = Array<Card>().concat(
          store.map.revealed?.relevant ?? [],
          store.map.revealed?.others ?? [],
        );

        store.resolveReveal({
          top: data.top.map((id) => allCards.find(c => c.id === id) as Card),
          bottom: data.bottom.map((id) => allCards.find(c => c.id === id) as Card),
          initiator: this.label,
        });
        break;
      }

      case Event.UPDATE_WALL_STATE: {
        const data = payload.data as ActPayload.UpdateWallState;
        if (data.val) {
          data.val = { ...data.val, initiator: this.label };
        }
        store.updateWallState({ ...data, initiator: this.label });
        break;
      }

      case Event.START_GAME: {
        store.startGame({ initiator: this.label });
        break;
      }

      case Event.HEY: {
        if (!store.mates.get(this.label)) {
          const data = payload.data as ActPayload.NameWire;
          store.hey({ ...data, id: this.label });
          this.send(stringify(Event.HEY, { name: myName }));
        }
        break;
      }
    }
  };
}
