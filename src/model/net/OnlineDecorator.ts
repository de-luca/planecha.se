import * as Payload from './payloads';
import { Card, Plane } from '../card';
import { Beacon } from './Beacon';
import { OnlineInterface } from './OnlineInterface';
import { PeerMap } from './PeerMap';
import { Event } from './Handler';
import { WallStates } from '../wall';
import {
  EncounterTriggers,
  Exported,
  MapSpecs,
  MapInterface,
  Revealed,
  Tile,
} from '../map';
import { ErrorFactory } from './error/beacon/ErrorFactory';

export class OnlineDecorator implements MapInterface, OnlineInterface {
  private beacon: Beacon;
  private peers: PeerMap;
  private map: MapInterface;

  private readyState: Promise<void>;

  public gameId: string;

  public constructor(map: MapInterface, name: string) {
    this.map = map;

    this.beacon = new Beacon();
    this.readyState = new Promise<void>((resolve, reject) => {
      this.beacon.addEventListener('ready', _ => resolve(), { once: true });
      this.beacon.addEventListener('error', ((event: CustomEvent<string>) => {
        reject(ErrorFactory.fromCode(event.detail));
      }) as EventListener, { once: true });
    });
    this.peers = new PeerMap(this.beacon, name);
  }

  public get walls(): WallStates {
    return this.map.walls;
  }

  public get yourName(): string {
    return this.peers.yourName;
  }

  public get specs(): MapSpecs {
    return this.map.specs;
  }

  public get active(): Array<Card> {
    return this.map.active;
  }

  public get remaining(): number {
    return this.map.remaining;
  }

  public get played(): Array<Card> {
    return this.map.played;
  }

  public get revealed(): Revealed | undefined {
    return this.map.revealed;
  }

  public get ready(): Promise<void> {
    return this.readyState;
  }

  public get tiles(): Array<Tile> {
    return this.map.tiles;
  }

  public get hasStarted(): boolean {
    return this.map.hasStarted;
  }
  public set hasStarted(hasStarted: boolean) {
    this.map.hasStarted = hasStarted;
  }

  public get destination(): Coordinates | undefined {
    return this.map.destination;
  }

  public get encounterTriggers(): EncounterTriggers {
    return this.map.encounterTriggers;
  }

  public chaos(initiator?: string): void {
    return this.map.chaos(initiator);
  }

  public planeswalk(coords?: Coordinates, initiator?: string): boolean {
    return this.map.planeswalk(coords, initiator);
  }

  public customPlaneswalk(planes: Array<Plane>, coords?: Coordinates): void {
    return this.map.customPlaneswalk(planes, coords);
  }

  public resolve(initiator?: string): boolean {
    return this.map.resolve(initiator);
  }

  public encounter(coords: Coordinates, initiator?: string): boolean {
    return this.map.encounter(coords, initiator);
  }

  public updateCounter(id: string, change: number): void {
    return this.map.updateCounter(id, change);
  }

  public revealUntil(count: number, type: typeof Card = Card): boolean {
    return this.map.revealUntil(count, type);
  }

  public resolveReveal(top: Card[], bottom: Card[]): void {
    return this.map.resolveReveal(top, bottom);
  }

  public export(): Exported {
    return this.map.export();
  }

  public applyUndo(state: Exported): void {
    return this.map.applyUndo(state);
  }

  public applyShuffle(state: Exported): void {
    return this.map.applyShuffle(state);
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

  public async join(gameId: string): Promise<void> {
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
    this.map = await this.peers.requestInit();
  }

  public leave(): void {
    this.beacon.close();
    this.peers.close();
  }

  public requestChaos(): void {
    this.peers.broadcast(Event.CHAOS);
  }

  public requestPlaneswalk(payload: Payload.Planeswalk): void {
    this.peers.broadcast(Event.PLANESWALK, payload);
  }

  public requestCustomPlaneswalk(payload: Payload.CustomPlaneswalk): void {
    this.peers.broadcast(Event.CUSTOM_PLANESWALK, {
      planes: payload.planes.map(c => c.id),
    });
  }

  public requestEncounter(payload: Payload.Encounter): void {
    this.peers.broadcast(Event.ENCOUNTER, payload);
  }

  public requestResolve(): void {
    this.peers.broadcast(Event.RESOLVE);
  }

  public requestCounterUpdate(payload: Payload.Counters): void {
    this.peers.broadcast(Event.COUNTERS, payload);
  }

  public requestReveal(payload: Payload.Reveal): void {
    this.peers.broadcast(Event.REVEAL, {
      count: payload.count,
      type: payload.type?.name,
    });
  }

  public requestResolveReveal(payload: Payload.ResolveReveal): void {
    this.peers.broadcast(Event.RESOLVE_REVEAL, {
      top: payload.top.map(c => c.id),
      bottom: payload.bottom.map(c => c.id),
    });
  }

  public requestUpdateWallState(payload: Payload.UpdateWallState): void {
    this.peers.broadcast(Event.UPDATE_WALL_STATE, payload);
  }

  public requestStartGame(): void {
    this.peers.broadcast(Event.START_GAME);
  }

  public requestUndo(payload: Payload.Undo): void {
    this.peers.broadcast(Event.UNDO, payload);
  }

  public requestShuffling(): void {
    this.peers.broadcast(Event.SHUFFLE, this.map.export());
  }
}
