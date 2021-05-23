import { Card } from "../card";
import { Map } from "../map";
import { Coordinates, MapInterface, MapType } from "../map/MapInterface";
import { Beacon } from "../net/Beacon";
import { PeerMap } from "../net/PeerMap";

export class OnlineDecorator implements MapInterface {
    private beacon: Beacon;
    private peers: PeerMap;
    private map: Map;

    private lock: Promise<void>;

    public constructor(map: Map) {
        this.map = map;

        this.beacon = new Beacon();
        this.lock = new Promise<void>((resolve) => {
            this.beacon.addEventListener('ready', _ => resolve());
        }).then(_ => this.beacon.create());

        this.beacon.addEventListener('created', ((event: CustomEvent<string>) => {
            console.log('CREATED', event.detail);
            // store.commit('');
        }) as EventListener);

        this.peers = new PeerMap(this.beacon);   
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
        return this.lock;
    }
    
    public getDeckSize(): number {
        return this.map.getDeckSize();
    }
    
    public planeswalk(coordinates?: Coordinates): void {
        return this.map.planeswalk(coordinates);
    }   
}
