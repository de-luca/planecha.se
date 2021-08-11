import { Card, Plane } from '../card';
import { Beacon } from './Beacon';
import { OnlineInterface } from './OnlineInterface';
import { PeerMap } from './PeerMap';
import { Event } from './Handler';
import {
  Coordinates,
  Exported,
  MapSpecs,
  MapInterface,
  Revealed,
  Tile,
} from '../map';

export class OnlineDecorator implements MapInterface, OnlineInterface {
  private beacon: Beacon;
  private peers: PeerMap;
  private map: MapInterface;

  private readyState: Promise<void>;

  public roomId: string;

  public constructor(map: MapInterface, name: string) {
    this.map = map;

    this.beacon = new Beacon();
    this.readyState = new Promise<void>((resolve) => {
        this.beacon.addEventListener('ready', _ => resolve());
    });
    this.peers = new PeerMap(this.beacon, name);
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

  public chaos(passive: boolean = false, mateId?: string): void {
    return this.map.chaos(passive, mateId);
  }

  public planeswalk(
    coordinates?: Coordinates,
    passive: boolean = false,
    mateId?: string,
  ): boolean {
    return this.map.planeswalk(coordinates, passive, mateId);
  }

  public customPlaneswalk(planes: Array<Plane>, coordinates?: Coordinates): void {
    return this.map.customPlaneswalk(planes, coordinates);
  }

  public planeswalkFromPhenomenon(passive: boolean = false, mateId?: string): boolean {
    return this.map.planeswalkFromPhenomenon(passive, mateId);
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

  public clearRevealed(): void {
    return this.map.clearRevealed();
  }

  public export(): Exported {
    return this.map.export();
  }

  public applyShuffle(state: Exported): void {
    return this.map.applyShuffle(state);
  }

  public create(): Promise<string> {
    const createPromise = new Promise<string>((resolve) => {
      this.beacon.addEventListener('created', ((event: CustomEvent<string>) => {
        console.log('CREATED', event.detail);
        this.roomId = event.detail;
        resolve(event.detail);
      }) as EventListener);
    });

    this.beacon.create();

    return createPromise;
  }

  public async join(roomId: string): Promise<void> {
    const peers = new Promise<Array<string>>((resolve) => {
      this.beacon.addEventListener('joined', ((event: CustomEvent<Array<string>>) => {
        console.log('JOINED', event.detail);
        this.roomId = roomId;
        resolve(event.detail);
      }) as EventListener);
    });
    this.beacon.join(roomId);
    await this.peers.addPeer(...await peers);
    this.map = await this.peers.requestInit();
  }

  public leave(): void {
    this.peers.close();
  }

  public requestChaos(): void {
    this.peers.broadcast(Event.CHAOS);
  }

  public requestPlaneswalk(coordinates?: Coordinates): void {
    this.peers.broadcast(Event.PLANESWALK, { coordinates });
  }

  public requestCustomPlaneswalk(payload: { planes: Array<string> }): void {
    this.peers.broadcast(Event.CUSTOM_PLANESWALK, payload);
  }

  public requestPlaneswalkFromPhenomenon(): void {
    this.peers.broadcast(Event.PLANESWALK_FROM_PHENOMENON);
  }

  public requestCounterUpdate(payload: { id: string, change: number }): void {
    this.peers.broadcast(Event.COUNTERS, payload);
  }

  public requestReveal(payload: { count: number, type?: string }): void {
    this.peers.broadcast(Event.REVEAL, payload);
  }

  public requestRevealResolution(
    payload: { top: Array<string>, bottom: Array<string> },
  ): void {
    this.peers.broadcast(Event.RESOLVE_REVEAL, payload);
  }

  public requestStartEternities(): void {
    this.peers.broadcast(Event.START_ETERNITIES);
  }

  public requestShuffling(): void {
    this.peers.broadcast(Event.SHUFFLE, this.map.export());
  }
}
