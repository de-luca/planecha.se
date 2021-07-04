import Container from 'typedi';
import { eventBus, EventType as BusEvent } from '@/services/EventBus';
import { MapFactory } from '../map/MapFactory';
import { Exported, MapInterface } from '../map/MapInterface';
import { Beacon, SignalData, SignalPayload } from './Beacon';
import { getHandler, Payload, Event, parse, stringify } from './Handler';

type Peer = {
  connection: RTCPeerConnection,
  channel: RTCDataChannel,
}

export class PeerMap {
  private static readonly channelConfig = { negotiated: true, id: 0 };
  private static readonly RTCConfig = {
    iceServers: [{ urls: 'stun:stun.1.google.com:19302' }],
  };

  private peers: Map<string, Peer>;
  private beacon: Beacon;
  public yourName: string;

  public constructor(beacon: Beacon, yourName: string) {
    this.peers = new Map();
    this.beacon = beacon;
    this.yourName = yourName;
    this.beacon.addEventListener('signal', (ev) => {
      this.signal((ev as CustomEvent<SignalPayload>).detail);
    });
  }

  public broadcast(event: Event, data: any = {}): void {
    this.peers.forEach(peer => peer.channel.send(stringify(event, data)));
  }

  public close(): void {
    this.peers.forEach((peer) => {
      peer.channel.close();
      peer.connection.close();
    });
  }

  public async requestInit(): Promise<MapInterface> {
    const p = this.peers.values().next().value as Peer;
    const payload: Payload<{}> = {
      event: Event.REQUEST_INIT,
      data: {},
    };

    const initRequest = new Promise<MapInterface>((resolve) => {
      const handler = (event: MessageEvent<string>) => {
        const payload = parse<Exported>(event.data);
        if (payload.event === Event.INIT) {
          const map = Container.get(MapFactory).restore(payload.data);
          p.channel.removeEventListener('message', handler);
          resolve(map);
        }
      };
      p.channel.addEventListener('message', handler);
    });

    p.channel.send(JSON.stringify(payload));
    return await initRequest;
  }

  public async addPeer(...ids: Array<string>): Promise<Array<void>> {
    const channelOpen: Array<Promise<void>> = [];

    for (const id of ids) {
      const peer = this.buildPeer(id);

      channelOpen.push(new Promise((resolve) => {
        peer.channel.onopen = _ => {
          peer.channel.send(stringify(Event.HEY, { name: this.yourName }));
          resolve();
        };
      }));

      const offer = await peer.connection.createOffer();
      await peer.connection.setLocalDescription(offer);
      this.beacon.signal(id, offer as SignalData);

      this.peers.set(id, peer);
    }

    return Promise.all(channelOpen);
  }

  private buildPeer(id: string): Peer {
    const connection = new RTCPeerConnection(PeerMap.RTCConfig);
    const channel = connection.createDataChannel(id, PeerMap.channelConfig);

    channel.onmessage = getHandler(this.yourName);
    connection.oniceconnectionstatechange = (_) => {
      if (connection.iceConnectionState === 'disconnected') {
        this.peers.delete(id);
        eventBus.emit(BusEvent.BYE, { mateId: id });
      }
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
      const peer = this.buildPeer(peerId);
      this.peers.set(peerId, peer);
    }

    await this.handleSignal(
      (this.peers.get(data.peerId) as Peer).connection,
      data,
    );
  }

  private async handleSignal(
    connection: RTCPeerConnection,
    data: SignalPayload,
  ): Promise<void> {
    switch (data.data.type) {
      case 'icecandidate':
        await connection.addIceCandidate(
          new RTCIceCandidate(data.data.candidate as RTCIceCandidateInit),
        );
        break;
      case 'offer':
        await connection.setRemoteDescription(data.data as RTCSessionDescriptionInit);
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        this.beacon.signal(data.peerId, answer as SignalData);
        break;
      case 'answer':
        await connection.setRemoteDescription(data.data as RTCSessionDescriptionInit);
        break;
    }
  }
}
