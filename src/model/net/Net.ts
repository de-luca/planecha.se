import {
  ActionReceiver,
  ActionReceiverSetter,
  ActionSender,
  Bridge,
} from '@planecha.se/bridge';

import { MapType } from '../map';
import type { InitPayload, MainStore } from '#/store/main';
import { Patch } from '#/utils/delta';

export enum EventType {
  PREFLIGHT = 'PREFLIGHT',
  JOIN = 'JOIN',
  INIT = 'INIT',
  HEY = 'HEY',
  SYNC = 'SYNC',
  UNDO = 'UNDO',
  FEED = 'FEED',
  RESET = 'RESET',
}

export interface Hey {
  name: string;
}

export interface NetInterface {
  gameId?: string;
  selfId?: string;
  connected: Promise<void>;

  set initHandler(handler: ActionReceiver<InitPayload>);

  getRoomInfo(): ReturnType<Bridge<GameData>['getInfo']>;

  create(gameData: GameData): Promise<void>;
  join(handler: ActionReceiver<InitPayload>): Promise<void>;

  hey(data: Hey): void;
  sync(patch: Patch): void;
  undo(index: number): void;
  syncFeed(log: string): void;
  reset(payload: InitPayload): void;
  init(payload: InitPayload): void;
  leave(): void;
}

interface GameData {
  mapType: MapType;
}

export class Net implements NetInterface {
  private store: MainStore;
  private bridge: Bridge<GameData>;

  private ready: boolean;
  private _gameId?: string;
  private _selfId?: string;

  private _initReceiver: ActionReceiverSetter<InitPayload>;

  public readonly hey: ActionSender<Hey>;
  public readonly sync: ActionSender<Patch>;
  public readonly undo: ActionSender<number>;
  public readonly syncFeed: ActionSender<string>;
  public readonly reset: ActionSender<InitPayload>;
  public readonly init: ActionSender<InitPayload>;

  public constructor(store: MainStore, gameId?: string) {
    this.ready = !gameId;
    this._gameId = gameId;

    this.store = store;
    this.bridge = Bridge.withBeacon(import.meta.env.VITE_BEACON_URL);

    const [initSender, initReceiver] = this.bridge.makeAction<InitPayload>(EventType.INIT);
    const [heySender, heyReceiver] = this.bridge.makeAction<Hey>(EventType.HEY);
    const [syncSender, syncReceiver] = this.bridge.makeAction<Patch>(EventType.SYNC);
    const [undoSender, undoReceiver] = this.bridge.makeAction<number>(EventType.UNDO);
    const [feedSender, feedReceiver] = this.bridge.makeAction<string>(EventType.FEED);
    const [resetSender, resetReceiver] = this.bridge.makeAction<InitPayload>(EventType.RESET);

    this._initReceiver = initReceiver;

    this.hey = heySender;
    this.sync = syncSender;
    this.undo = undoSender;
    this.syncFeed = feedSender;
    this.reset = resetSender;
    this.init = initSender;

    this.bridge.onPeerLeave(peerId => this.store.bye({ id: peerId }));
    this.bridge.onPeerJoin(peerId => {
      if (this.ready) {
        initSender(this.store.initPayload, peerId);
      }
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

  public get connected() {
    return this.bridge.ready;
  }

  public get gameId() {
    return this._gameId;
  }

  public get selfId() {
    return this._selfId;
  }

  public set initHandler(handler: ActionReceiver<InitPayload>) {
    this._initReceiver(handler);
  }

  public async create(gameData: GameData): Promise<void> {
    const data = await this.bridge.create(gameData);
    this._gameId = data.room;
    this._selfId = data.you;
  }

  public getRoomInfo() {
    return this.bridge.getInfo(this.gameId!);
  }

  public async join(handler: ActionReceiver<InitPayload>): Promise<void> {
    return new Promise<void>(async(resolve, reject) => {
      const timeout = setTimeout(() => {
        this.bridge.leave();
        reject(new Error(
          'Could not retrieve game state.',
          { cause: 'Operation timed out. An error occured while getting the game state.' },
        ));
      }, 5000);

      this._initReceiver((data, peer) => {
        handler(data, peer);
        clearTimeout(timeout);
        this.init(this.store.initPayload);
        this.ready = true;
        resolve();
      });
      const data = await this.bridge.join(this._gameId!);
      this._selfId = data.you;
    });
  }

  public leave(): void {
    this.bridge.leave();
  }
}
