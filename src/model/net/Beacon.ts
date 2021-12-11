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
  ERROR = 'error',
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
    this.socket.onopen = _ => this.open();
    this.socket.onerror = (_) => {
      this.dispatchEvent(new CustomEvent<string>(EventType.ERROR, {
        detail: 'CONNECTION_FAILED',
      }));
    };
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
    this.socket.send(JSON.stringify({ method, params }));
  }

  private open(): void {
    this.socket.onopen = null;
    this.socket.onerror = null;
    this.socket.onmessage = event => this.handle(event);
    this.dispatchEvent(new Event(EventType.READY));
  }

  private handle(event: MessageEvent<string>): void {
    try {
      const data = JSON.parse(event.data) as Response<any>;
      switch(data.event) {
        case EventType.CREATED:
          return this.dispatch<string>(EventType.CREATED, data.data);
        case EventType.JOINED:
          return this.dispatch<Array<string>>(EventType.JOINED, data.data);
        case EventType.SIGNAL:
          return this.dispatch<SignalPayload>(EventType.SIGNAL, data.data);
        case EventType.ERROR:
        default:
          return this.dispatch<string>(EventType.ERROR, data.data);
      }
    } catch(err) {
      this.dispatch<string>(EventType.ERROR, 'UNPROCESSABLE SERVER MESSAGE');
    }
  }

  private dispatch<T>(event: EventType, data: T): void {
    this.dispatchEvent(new CustomEvent<T>(event, { detail: data as T }));
  }
}
