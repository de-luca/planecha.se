import { ActionSender, ActionReceiver, joinRoom, Room, selfId } from 'trystero';
import { Patch } from '../ver';
import type { InitPayload, PreflightPayload, useMain } from '#/store/main';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fun<TA extends any[] = any[], TR = any> = (...args: TA) => TR;
type Store = ReturnType<typeof useMain>;

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

function once<T extends Fun>(fun: T): T {
  let invs = 0;
  return ((...args: Parameters<T>) => {
    if (invs < 1) {
      invs++;
      return fun(...args);
    }
  }) as T;
}

export interface GameInterface {
  gameId: string;
  connected: Promise<PreflightPayload | void>;
  join(): Promise<void>;
  hey(data: Hey): void;
  sync(patch: Patch): void;
  undo(index: number): void;
  syncFeed(log: string): void;
  reset(payload: InitPayload): void;
  leave(): void;
}

export class Game implements GameInterface {
  private static readonly gameIdLength = 20;
  private static readonly gameIdCharSet = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
  private static readonly appId = 'dev-planechase';

  public static readonly selfId = selfId;

  public readonly gameId: string;
  private store: Store;
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

  public constructor(store: Store, gameId?: string) {
    this.ready = !gameId;

    this.gameId = gameId ?? Game.genId();
    this.store = store;
    this.room = joinRoom({ appId: Game.appId }, this.gameId);

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

    this.room.onPeerJoin((peerId) => {
      if (this.ready) {
        preflightSender(this.store.gameStatus, peerId);
      }
    });

    this.room.onPeerLeave(peerId => this.store.bye({ id: peerId }));

    joinReceiver((_, peerId) => {
      if (this.ready) {
        initSender(this.store.initPayload, peerId);
      }
      heySender({ name: this.store.selfName! }, peerId);
    });


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

    heyReceiver((data, peerId) => {
      if (this.store.mates.has(peerId)) {
        this.store.mates.set(peerId, data.name);
      } else {
        this.store.hey({ ...data, id: peerId });
        heySender({ name: this.store.selfName! }, peerId);
      }
    });
    syncReceiver((data) => this.store.apply(data));
    undoReceiver((data) => this.store.applyUndo(data));
    feedReceiver((data) => this.store.feed.push(data));
    resetReceiver((data) => this.store.applyReset(data));
  }

  public join(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.room.leave();
        reject(new Error(
          'Could not retrieve game state.',
          { cause: 'Operation timed out. An error occured while getting the game state.'},
        ));
      }, 5000);

      this.initReceiver(once((data) => {
        clearTimeout(timeout);
        this.store.applyReset(data);
        this.ready = true;
        resolve();
      }));

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
