import { getEnv } from '@/services/getEnv';

enum Method {
  CREATE = 'create',
  JOIN = 'join',
  SIGNAL = 'signal',
}

enum EventType {
  READY = 'ready',
  CREATED = 'created',
  JOINED = 'joined',
  SIGNAL = 'signal',
}

interface Response<T> {
  event: EventType;
  data: T
}

export interface SignalData {
  type: 'offer' | 'answer' | 'icecandidate';
  [key: string]: unknown;
}

export interface SignalPayload {
  peerId: string;
  data: SignalData;
}

type Param = {} | { roomId: string } | SignalData;

export class Beacon extends EventTarget {
  private socket: WebSocket;

  public constructor() {
    super();

    this.socket = new WebSocket(getEnv('VITE_BEACON_URL') as string);
    this.socket.onopen = () => this.open();
  }

  public static check(): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new WebSocket(getEnv('VITE_BEACON_URL') as string);
      socket.onerror = () => {
        socket.close();
        resolve(false);
      };
      socket.onopen = () => {
        socket.close();
        resolve(true);
      };
    });
  }

  public create(): void {
    this.send(Method.CREATE);
  }

  public join(roomId: string): void {
    this.send(Method.JOIN, { roomId });
  }

  public close(): void {
    this.socket.close();
  }

  public signal(peerId: string, data: SignalData): void {
    this.send(Method.SIGNAL, { peerId, data });
  }

  private send(method: Method, params: Param = {}): void {
    this.socket.send(
      JSON.stringify({ method, params }),
    );
  }

  private open(): void {
    this.socket.onmessage = (ev) => this.handle(ev);
    this.dispatchEvent(new Event(EventType.READY));
  }

  private handle(event: MessageEvent<string>): void {
    const data = JSON.parse(event.data) as Response<any>;
    switch(data.event) {
      case EventType.CREATED:
        this.dispatchEvent(new CustomEvent<string>(EventType.CREATED, {
          detail: data.data as string,
        }));
        break;
      case EventType.JOINED:
        this.dispatchEvent(new CustomEvent<string>(EventType.JOINED, {
          detail: data.data as string,
        }));
        break;
      case EventType.SIGNAL:
        this.dispatchEvent(new CustomEvent<SignalData>(EventType.SIGNAL, {
          detail: data.data as SignalData,
        }));
        break;
    }
  }
}
