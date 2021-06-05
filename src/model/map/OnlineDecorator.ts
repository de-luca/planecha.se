import { Card } from "../card";
import { Coordinates, Exported, MapInterface, MapType } from "./MapInterface";
import { Beacon } from "../net/Beacon";
import { OnlineInterface } from "../net/OnlineInterface";
import { PeerMap } from "../net/PeerMap";
import { Log } from "@/store/states/map";

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

    public export(): Exported {
        return this.map.export();
    }

    public getLog(): Omit<Log, "initiator"> {
        return this.map.getLog();
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

    public requestPlaneswalk(coordinates?: Coordinates): void {
        this.peers.broadcast();
    }
}
