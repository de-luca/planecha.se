import { MapInterface } from '../map';
import { Beacon } from './Beacon';
import { ErrorFactory } from './error/beacon/ErrorFactory';
import { PeerMap, RequestInitOutput } from './PeerMap';
import { Event } from './Handler';
import { Patch, RepositoryInterface } from '../versioning';

export interface BridgeInterface {
  ready: Promise<void>;
  getPlayerName(): string;
  getGameId(): string;
  create(): Promise<string>;
  join(gameId: string): Promise<RequestInitOutput>;
  leave(): void;
  sync(payload: any): void;
  revert(index: number): void;
}

export class Bridge implements BridgeInterface {
  private beacon: Beacon;
  private peers: PeerMap;
  private readyState: Promise<void>;
  private gameId: string;

  public constructor(playerName: string)  {
    this.beacon = new Beacon();
    this.readyState = new Promise<void>((resolve, reject) => {
      this.beacon.addEventListener('ready', _ => resolve(), { once: true });
      this.beacon.addEventListener('error', ((event: CustomEvent<string>) => {
        reject(ErrorFactory.fromCode(event.detail));
      }) as EventListener, { once: true });
    });
    this.peers = new PeerMap(this.beacon, playerName);
  }

  public get ready(): Promise<void> {
    return this.readyState;
  }

  public getPlayerName(): string {
    return this.peers.playerName;
  }

  public getGameId(): string {
    return this.gameId;
  }

  public create(): Promise<string> {
    const createPromise = new Promise<string>((resolve) => {
      this.beacon.addEventListener('created', ((event: CustomEvent<string>) => {
        this.gameId = event.detail;
        resolve(event.detail);
      }) as EventListener, { once: true });
    });

    this.beacon.create();

    return createPromise;
  }

  public async join(gameId: string): Promise<RequestInitOutput> {
    const peers = new Promise<Array<string>>((resolve, reject) => {
      this.beacon.addEventListener('joined', ((event: CustomEvent<Array<string>>) => {
        this.gameId = gameId;
        resolve(event.detail);
      }) as EventListener, { once: true });

      this.beacon.addEventListener('error', ((event: CustomEvent<string>) => {
        reject(ErrorFactory.fromCode(event.detail));
      }) as EventListener, { once: true });
    });
    this.beacon.join(gameId);

    await this.peers.addPeer(...await peers);

    return this.peers.requestInit();
  }

  public leave(): void {
    this.beacon.close();
    this.peers.close();
  }

  public sync(patch: Patch): void {
    this.peers.broadcast(Event.SYNC, patch);
  }

  public revert(index: number): void {
    this.peers.broadcast(Event.REVERT, index);
  }
}
