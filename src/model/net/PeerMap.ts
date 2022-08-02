import { Container } from 'typedi';
import { getEnv } from '@/services/getEnv';
import { MapFactory } from '../map';
import { Beacon, SignalData, SignalPayload } from './Beacon';
import { PeerLogs } from './PeerLogs';
import { PeerICEError } from './error/PeerICEError';
import { Patch, Repo } from '../ver';
import { Event, Hey, InitPayload, Payload, RequestInitOutput } from './types';
import { getHandler, parse, stringify } from './Handler';
import { useMain } from '@/store/main';

interface Peer {
  connection: RTCPeerConnection;
  channel: RTCDataChannel;
  logs: PeerLogs;
}

export class PeerMap {
  private static readonly channelConfig = { negotiated: true, id: 0 };
  private static readonly RTCConfig = {
    iceServers: [
      { urls: 'stun:stun.1.google.com:19302' },
      {
        urls: getEnv('VITE_TURN_URL') as string,
        username: getEnv('VITE_TURN_USER') as string,
        credential: getEnv('VITE_TURN_CRED') as string,
      },
    ],
  };

  private peers: Map<string, Peer>;
  private beacon: Beacon;

  public readonly playerName: string;

  public constructor(beacon: Beacon, playerName: string) {
    this.peers = new Map();
    this.beacon = beacon;
    this.playerName = playerName;
    this.beacon.addEventListener('signal', (ev) => {
      this.signal((ev as CustomEvent<SignalPayload>).detail);
    });
  }

  public broadcast(event: Event.FEED, data: string): void;
  public broadcast(event: Event.REVERT, data: number): void;
  public broadcast(event: Event.SYNC, data: Patch): void;
  public broadcast(event: Event.HEY, data: Hey): void;
  public broadcast(event: Event, data: any = {}): void {
    this.peers.forEach(peer => peer.channel.send(stringify(event, data)));
  }

  public close(): void {
    this.peers.forEach((peer) => {
      peer.channel.close();
      peer.connection.close();
    });
  }

  public async requestInit(): Promise<RequestInitOutput> {
    const p = this.peers.values().next().value as Peer;
    const payload: Payload<{}> = {
      event: Event.REQUEST_INIT,
      data: {},
    };

    const initRequest = new Promise<RequestInitOutput>((resolve) => {
      const handler = function(this: RTCDataChannel, event: MessageEvent<string>) {
        const payload = parse<InitPayload>(event.data);

        if (payload.event === Event.INIT) {
          p.channel.removeEventListener('message', handler);
          resolve([
            Container.get(MapFactory).restore(payload.data.map),
            new Repo(payload.data.repo),
            payload.data.feed,
          ]);
        }
      };
      p.channel.addEventListener('message', handler);
    });

    p.channel.send(JSON.stringify(payload));
    return initRequest;
  }

  public async addPeer(...ids: Array<string>): Promise<Array<void>> {
    const channelOpen: Array<Promise<void>> = [];

    for (const id of ids) {
      const peer = this.buildPeer(id);

      channelOpen.push(new Promise((resolve, reject) => {
        peer.connection.addEventListener('iceconnectionstatechange', () => {
          if (peer.connection.iceConnectionState === 'failed') {
            reject(new PeerICEError(peer.logs));
          }
        });

        peer.channel.addEventListener(
          'open',
          () => {
            peer.channel.send(
              stringify(Event.HEY, { name: this.playerName }),
            );

            resolve();
            setTimeout(_ => {reject(new PeerICEError(peer.logs));}, 30000);
          },
          { once: true },
        );
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
    const logs = new PeerLogs();

    channel.addEventListener('message', getHandler(this.playerName));

    connection.addEventListener('icecandidate', ({ candidate }) => {
      if (candidate) {
        this.beacon.signal(id, {
          type: 'icecandidate',
          candidate: candidate.toJSON() as unknown,
        });
      }
    });

    connection.addEventListener('iceconnectionstatechange', () => {
      if (connection.iceConnectionState === 'failed') {
        this.peers.delete(id);
        useMain().bye({ id });
      }

      logs.push('iceConnectionState', connection.iceConnectionState);
    });

    connection.onconnectionstatechange = _ => logs.push('connectionState', connection.connectionState);
    connection.onicegatheringstatechange = _ => logs.push('iceGatheringState', connection.iceGatheringState);
    connection.onsignalingstatechange = _ => logs.push('signalingState', connection.signalingState);

    return { connection, channel, logs };
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
