import { Card } from "../card";
import { Map } from "../map";
import { Coordinates, MapInterface, MapType } from "../map/MapInterface";
import { Beacon } from "../net/Beacon";
import { OnlineInterface } from "../net/OnlineInterface";
import { PeerMap } from "../net/PeerMap";

export class OnlineDecorator implements MapInterface, OnlineInterface {
    private beacon: Beacon;
    private peers: PeerMap;
    private map: MapInterface;

    private readyState: Promise<void>;

    public constructor(map: MapInterface) {
        this.map = map;

        this.beacon = new Beacon();
        this.readyState = new Promise<void>((resolve) => {
            this.beacon.addEventListener('ready', _ => resolve());
        });
        this.peers = new PeerMap(this.beacon);   
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

    public join(roomId: string): void {
        this.beacon.addEventListener('joined', ((event: CustomEvent<Array<string>>) => {
            console.log('JOINED', event.detail);
            this.peers.addPeer(...event.detail);
            // store.commit('');
        }) as EventListener);

        this.beacon.join(roomId);
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
    
    public planeswalk(coordinates?: Coordinates): void {
        return this.map.planeswalk(coordinates);
    }   
}
