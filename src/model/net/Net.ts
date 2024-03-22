import {
  ActionReceiver,
  ActionSender,
  Room,
  joinRoom,
  // @ts-expect-error Typing is kinda broken
  getRelaySockets,
} from 'trystero';
import { BlockedError, OfflineError, TimeoutError } from './errors';
import type { InitPayload, MainStore } from '#/store/main';

import { Patch } from '#/utils/delta';
import { MapType } from '#/model/map';
import { once } from '#/utils/invoke';

const CHARSET = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';

export const genId = (n: number) =>
  [...Array(n)]
    .map(() => CHARSET[Math.floor(Math.random() * CHARSET.length)])
    .join('');

export enum EventType {
  BOOT = 'BOOT',
  JOIN = 'JOIN',
  INIT = 'INIT',
  HEY = 'HEY',
  SYNC = 'SYNC',
  UNDO = 'UNDO',
  FEED = 'FEED',
  RESET = 'RESET',
}

export type Hey = {
  name: string;
}

interface GameData {
  mapType: MapType;
}

type Props = { store: MainStore }
  & ({
    gameId: string;
    gameData?: undefined;
  } | {
    gameId?: undefined;
    gameData: GameData
  });

type InitHandler = Parameters<ActionReceiver<InitPayload>>[0];

type AsType<T> = { [P in keyof T]: AsType<T[P]>; };

export interface NetInterface {
  gameId: string;
  gameData: GameData;
  peerCount: number;

  set initHandler(handler: InitHandler);

  join(handler: InitHandler): Promise<void>;

  hey(data: Hey): void;
  sync(patch: Patch): void;
  undo(index: number): void;
  feed(log: string): void;
  reset(payload: InitPayload): void;
  init(payload: InitPayload): void;
  leave(): void;
}

export class Net implements NetInterface {
  private store: MainStore;
  private room: Room;

  private ready: boolean;
  private _gameId: string;
  private _gameData: GameData;

  private _boot: Promise<void>;

  private _initReceiver: ActionReceiver<InitPayload>;

  private _join: ActionSender<null>;
  private _hey: ActionSender<Hey>;
  private _sync: ActionSender<Patch>;
  private _undo: ActionSender<number>;
  private _feed: ActionSender<string>;
  private _reset: ActionSender<InitPayload>;
  private _init: ActionSender<InitPayload>;

  private constructor({ store, gameId, gameData }: Props) {
    this.store = store;
    this.ready = !gameId;
    this._gameId = gameId ?? genId(20);
    if (gameData) {
      this._gameData = gameData;
    }

    this.room = joinRoom({ appId: import.meta.env.VITE_APP_ID }, this._gameId);

    const [bootSender, bootReceiver] = this.room.makeAction<AsType<GameData>>(EventType.BOOT);
    const [joinSender, joinReceiver] = this.room.makeAction<null>(EventType.JOIN);
    const [initSender, initReceiver] = this.room.makeAction<AsType<InitPayload>>(EventType.INIT);
    const [heySender, heyReceiver] = this.room.makeAction<Hey>(EventType.HEY);
    const [syncSender, syncReceiver] = this.room.makeAction<AsType<Patch>>(EventType.SYNC);
    const [undoSender, undoReceiver] = this.room.makeAction<number>(EventType.UNDO);
    const [feedSender, feedReceiver] = this.room.makeAction<string>(EventType.FEED);
    const [resetSender, resetReceiver] = this.room.makeAction<AsType<InitPayload>>(EventType.RESET);

    this._initReceiver = initReceiver;

    this._join = joinSender;
    this._hey = heySender;
    this._sync = syncSender;
    this._undo = undoSender;
    this._feed = feedSender;
    this._reset = resetSender;
    this._init = initSender;

    this.room.onPeerJoin(peerId => this.ready && bootSender(this.gameData, peerId));
    this.room.onPeerLeave(peerId => this.store.bye({ id: peerId }));

    this._boot = gameData
      ? Promise.resolve()
      : new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(this.diagnoseError()), 5000);
          bootReceiver(once((data) => {
            this._gameData = data;
            clearTimeout(timeout);
            resolve();
          }));
        });


    joinReceiver((_, peerId) => {
      this.ready && initSender(this.store.initPayload, peerId);
      heySender({ name: this.store.selfName! }, peerId);
    });

    heyReceiver((data, peerId) => {
      if (store.mates.has(peerId)) {
        store.mates.set(peerId, data.name);
      } else {
        store.hey({ ...data, id: peerId });
        heySender({ name: store.selfName! }, peerId);
      }
    });

    syncReceiver((data, peerId) => store.apply(data, peerId));
    undoReceiver((data) => store.applyUndo(data));
    feedReceiver((data) => store.feed.push(data));
    resetReceiver((data) => store.applyReset(data));
  }

  public get gameId() {
    return this._gameId;
  }

  public get gameData(): GameData {
    return this._gameData;
  }

  public get peerCount() {
    return Object.keys(this.room.getPeers()).length;
  }

  public get hey() {
    return this._hey;
  }

  public get sync() {
    return this._sync;
  }

  public get undo() {
    return this._undo;
  }

  public get feed() {
    return this._feed;
  }

  public get reset() {
    return this._reset;
  }

  public get init() {
    return this._init;
  }

  public set initHandler(handler: InitHandler) {
    this._initReceiver(handler);
  }

  public static async create(store: MainStore, gameData: GameData): Promise<Net> {
    return new this({ store, gameData });
  }

  public static async boot(store: MainStore, gameId: string): Promise<Net> {
    const net = new this({ store, gameId });
    await net._boot;
    return net;
  }

  public async join(handler: InitHandler): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        this.room.leave();
        reject(this.diagnoseError());
      }, 5000);

      this._initReceiver((data, peer) => {
        clearTimeout(timeout);
        handler(data, peer);
        this.init(this.store.initPayload);
        this.ready = true;
        resolve();
      });

      this._join(null);
    });
  }

  public leave(): void {
    this.room.leave();
  }

  private diagnoseError(): Error {
    if (!navigator.onLine) {
      return new OfflineError();
    }

    if (
      Object.values(getRelaySockets() as Record<string, WebSocket>)
        .every(ws => ws.readyState !== WebSocket.OPEN)
    ) {
      return new BlockedError();
    }

    return new TimeoutError();
  }
}
