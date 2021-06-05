import { Card } from "../card";
import { Coordinates, Exported, MapInterface, MapType } from "./MapInterface";
import { Beacon } from "../net/Beacon";
import { OnlineInterface } from "../net/OnlineInterface";
import { PeerMap } from "../net/PeerMap";
import { Log } from "@/store/states/map";
import { Event } from "../net/Handler";

export class OnlineDecorator implements MapInterface, OnlineInterface {
    private beacon: Beacon;
    private peers: PeerMap;
    private map: MapInterface;

    private readyState: Promise<void>;

    public constructor(map: MapInterface, name: string) {
        this.map = map;

        this.beacon = new Beacon();
        this.readyState = new Promise<void>((resolve) => {
            this.beacon.addEventListener('ready', _ => resolve());
        });
        this.peers = new PeerMap(this.beacon, name);   
    }
    

    public get type(): MapType {
        return this.map.type;
    }

    public get active(): Array<Card> {
        return this.map.active;
    }
    
    public get played(): Array<Card> {
        return this.map.played;
    }

    public get ready(): Promise<void> {
        return this.readyState;
    }
    
    public getDeckSize(): number {
        return this.map.getDeckSize();
    }

    public chaos(): void {
        return this.map.chaos();
    }
    
    public planeswalk(coordinates?: Coordinates): void {
        return this.map.planeswalk(coordinates);
    }

    public updateCounter(id: string, change: number): void {
        return this.map.updateCounter(id, change);
    }

    public export(): Exported {
        return this.map.export();
    }

    public getPlaneswalkLog(): Omit<Log, "initiator"> {
        return this.map.getPlaneswalkLog();
    }

    public getCounterLog(id: string, change: number): Omit<Log, 'initiator'> {
        return this.map.getCounterLog(id, change);
    }

    public create(): Promise<string> {
        const createPromise = new Promise<string>((resolve) => {
            this.beacon.addEventListener('created', ((event: CustomEvent<string>) => {
                console.log('CREATED', event.detail);
                // store.commit('');
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
                resolve(event.detail);
            }) as EventListener)
        });
        this.beacon.join(roomId);
        await this.peers.addPeer(...await peers);
        this.map = await this.peers.requestInit();
    }

    public requestChaos(): void {
        this.peers.broadcast(Event.CHAOS);
    }

    public requestPlaneswalk(coordinates?: Coordinates): void {
        this.peers.broadcast(Event.PLANESWALK);
    }

    public requestCounterUpdate({ id, change }: { id: string, change: number }): void {
        this.peers.broadcast(Event.COUNTERS, { id, change });
    }
}
