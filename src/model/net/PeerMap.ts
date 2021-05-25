import { Beacon, SignalData, SignalPayload } from './Beacon';

type Peer = { 
    connection: RTCPeerConnection,
    channel: RTCDataChannel,
}

export class PeerMap {
    private static readonly channelConfig = { negotiated: true, id: 0 };
    private static readonly RTCConfig = {
        iceServers: [{ urls: "stun:stun.1.google.com:19302" }],
    };

    private peers: Map<string, Peer>;
    private beacon: Beacon;

    public constructor(beacon: Beacon) {
        this.peers = new Map();
        this.beacon = beacon;
        this.beacon.addEventListener('signal', (ev) => {
            this.signal((ev as CustomEvent<SignalPayload>).detail);
        });
    }

    public async addPeer(...ids: Array<string>): Promise<void> {
        for (const id of ids) {
            const peer = this.buildPeer(id);

            const offer = await peer.connection.createOffer();
            await peer.connection.setLocalDescription(offer);
            this.beacon.signal(id, offer as SignalData);

            this.peers.set(id, peer);
        }
    }

    private buildPeer(id: string): Peer {
        const connection = new RTCPeerConnection(PeerMap.RTCConfig);
        const channel = connection.createDataChannel(id, PeerMap.channelConfig);

        channel.onopen = _ => console.log('CHANNEL OPEN');
        channel.onmessage = e => console.log(e);
        connection.oniceconnectionstatechange = (_) => {
            console.log('[oniceconnectionstatechange]', connection.iceConnectionState);
        };
        connection.onicecandidate = ({ candidate }) => {
            if (candidate) {
                this.beacon.signal(id, {
                    type: 'icecandidate',
                    candidate: candidate.toJSON() as unknown,
                });
            }
        };

        return { connection, channel };
    }

    private async signal(data: SignalPayload): Promise<void> {
        const peerId = data.peerId;

        if (!this.peers.has(peerId)) {
            this.peers.set(peerId, this.buildPeer(peerId));
        }

        await this.handleSignal(
            (this.peers.get(data.peerId) as Peer).connection,
            data,
        );
    }

    private async handleSignal(
        connection: RTCPeerConnection, 
        data: SignalPayload
    ): Promise<void> {
        switch (data.data.type) {
            case 'icecandidate':
                await connection.addIceCandidate(
                    new RTCIceCandidate(
                        data.data.candidate as RTCIceCandidateInit,
                    ),
                );
                break;
            case 'offer':
                await connection.setRemoteDescription(
                    data.data as RTCSessionDescriptionInit,
                );
                const answer = await connection.createAnswer();
                await connection.setLocalDescription(answer);
                this.beacon.signal(data.peerId, answer as SignalData);
                break;
            case 'answer':
                await connection.setRemoteDescription(
                    data.data as RTCSessionDescriptionInit,
                );
                break;
        }
    }
    
}