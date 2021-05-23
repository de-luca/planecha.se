import SimplePeer, { Instance as Peer } from 'simple-peer';
import { Beacon, SignalData } from './Beacon';

export class PeerMap {
    private peers: Map<string, Peer>;
    private beacon: Beacon;

    public constructor(beacon: Beacon) {
        this.peers = new Map();
        this.beacon = beacon;
        this.beacon.addEventListener('signal', (ev) => {
            this.signal((ev as CustomEvent<SignalData>).detail);
        });
    }

    // public addPeer(...ids: Array<string>): void {
    //     for (const id of ids) {
    //         const peer = new SimplePeer({ initiator: true });
    //         peer.on('signal', data => this.beacon.signal(id, data));
    //         this.peers.set(id, peer);
    //     }
    // }

    private signal(data: SignalData): void {
        const peerId = data.peerId;

        if (!this.peers.has(peerId)) {
            const peer = new SimplePeer();
            peer.on('signal', data => this.beacon.signal(peerId, data));
            this.peers.set(peerId, peer);
        }

        // (this.peers.get(peerId) as Peer)
        //     .signal(data.data.data as SimplePeer.SignalData);
    }
}