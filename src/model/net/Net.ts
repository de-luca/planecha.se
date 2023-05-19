import { ActionSender, ActionReceiver, joinRoom, Room, selfId } from 'trystero';

import type { InitPayload, MainStore, PreflightPayload } from '#/store/main';
import { once } from '#/utils/invoke';
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
  gameId: string;
  connected: Promise<PreflightPayload | void>;
  peerCount: number;

  join(handler: JoinHandlerBuilder): Promise<void>;
  setInitHandler(handler: InitHandlerBuilder): ThisType<this>;

  hey(data: Hey): void;
  sync(patch: Patch): void;
  undo(index: number): void;
  syncFeed(log: string): void;
  reset(payload: InitPayload): void;
  init(payload: InitPayload): void;
  leave(): void;
}

interface JoinHandlerBuilder {
  (props: {
    store: MainStore;
    done: () => void;
  }): (data: InitPayload, peer: string) => void;
}

interface InitHandlerBuilder {
  (store: MainStore): (data: InitPayload, peer: string) => void;
}


export class Net implements NetInterface {
  private static readonly gameIdLength = 20;
  private static readonly gameIdCharSet = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
  private static readonly appId = 'dev-planechase';

  public static readonly selfId = selfId;

  public readonly gameId: string;
  private store: MainStore;
  private room: Room;

  public readonly connected: Promise<PreflightPayload | void>;
  private ready: boolean;

  private readonly joinSender: ActionSender<Record<string, never>>;
  private readonly initReceiver: ActionReceiver<InitPayload>;

  public readonly hey: ActionSender<Hey>;
  public readonly sync: ActionSender<Patch>;
  public readonly undo: ActionSender<number>;
  public readonly syncFeed: ActionSender<string>;
  public readonly reset: ActionSender<InitPayload>;
  public readonly init: ActionSender<InitPayload>;

  public constructor(store: MainStore, gameId?: string) {
    this.ready = !gameId;

    this.gameId = gameId ?? Net.genId();
    this.store = store;
    this.room = joinRoom({ appId: Net.appId }, this.gameId);

    const [preflightSender, preflightReceiver] = this.room.makeAction<PreflightPayload>(EventType.PREFLIGHT);
    const [joinSender, joinReceiver] = this.room.makeAction<Record<string, never>>(EventType.JOIN);
    const [initSender, initReceiver] = this.room.makeAction<InitPayload>(EventType.INIT);
    const [heySender, heyReceiver] = this.room.makeAction<Hey>(EventType.HEY);
    const [syncSender, syncReceiver] = this.room.makeAction<Patch>(EventType.SYNC);
    const [undoSender, undoReceiver] = this.room.makeAction<number>(EventType.UNDO);
    const [feedSender, feedReceiver] = this.room.makeAction<string>(EventType.FEED);
    const [resetSender, resetReceiver] = this.room.makeAction<InitPayload>(EventType.RESET);

    this.joinSender = joinSender;
    this.initReceiver = initReceiver;

    this.hey = heySender;
    this.sync = syncSender;
    this.undo = undoSender;
    this.syncFeed = feedSender;
    this.reset = resetSender;
    this.init = initSender;

    this.room.onPeerJoin((peerId) => {
      if (this.ready) {
        preflightSender(this.store.gameStatus, peerId);
      }
    });

    this.room.onPeerLeave(peerId => this.store.bye({ id: peerId }));

    this.connected = new Promise<PreflightPayload | void>((resolve, reject) => {
      if (!gameId) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        this.room.leave();
        reject(new Error(
          'The game could not be found.',
          { cause: 'Operation timed out. The game might not exists anymore.' },
        ));
      }, 5000);

      preflightReceiver(once((data) => {
        clearTimeout(timeout);
        resolve(data);
      }));
    });

    joinReceiver((_, peerId) => {
      if (this.ready) {
        initSender(store.initPayload, peerId);
      }
      heySender({ name: store.selfName! }, peerId);
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

  public get peerCount(): number {
    return Object.keys(this.room.getPeers()).length;
  }

  public setInitHandler(handler: InitHandlerBuilder): this {
    this.initReceiver(handler(this.store));
    return this;
  }

  public join(handler: JoinHandlerBuilder): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.room.leave();
        reject(new Error(
          'Could not retrieve game state.',
          { cause: 'Operation timed out. An error occured while getting the game state.' },
        ));
      }, 5000);

      const done = () => {
        clearTimeout(timeout);
        this.init(this.store.initPayload);
        this.ready = true;
        resolve();
      };

      this.initReceiver(handler({ done, store: this.store }));
      this.joinSender({});
    });
  }

  public leave(): void {
    this.room.leave();
  }

  private static genId(): string {
    return new Array(this.gameIdLength)
      .fill('')
      .map(() => this.gameIdCharSet[Math.floor(Math.random() * this.gameIdCharSet.length)])
      .join('');
  }
}
