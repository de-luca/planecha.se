import { Beacon } from './Beacon';
import WS from "jest-websocket-mock";

let srv: WS;

beforeEach(() => {
    srv = new WS("ws://localhost:3030", { jsonProtocol: true });
});

afterEach(() => {
    srv.close();
})

describe('Beacon.constructor', () => {
    it('starts a websocket and emit ready event', async() => {
        const beacon = await new Promise<Beacon>((resolve) => {
            const beacon = new Beacon();
            beacon.addEventListener('ready', (_ev) => {
                resolve(beacon);
            });
        }); 
        expect(beacon['socket'].readyState).toEqual(1);
    });
});

describe('Beacon.send', () => {
    it('sends a create/join/signal payload', async () => {
        const beacon = new Beacon();
        await srv.connected;

        beacon.create();
        await expect(srv).toReceiveMessage({
            method: 'create',
            params: {},
        });

        beacon.join('00000000-0000-0000-0000-000000000000');
        await expect(srv).toReceiveMessage({
            method: 'join',
            params: { roomId: '00000000-0000-0000-0000-000000000000' },
        });

        beacon.signal(
            '00000000-0000-0000-0000-000000000000', 
            { type: 'offer', data: { foo: 'bar' } },
        );
        await expect(srv).toReceiveMessage({
            method: 'signal',
            params: {
                peerId: '00000000-0000-0000-0000-000000000000',
                data: { type: 'offer', data: { foo: 'bar' } },
            },
        });
    });
});


describe('Beacon.handle', () => {
    it('receives events', async () => {
        const beacon = new Beacon();
        await srv.connected;

        const createdData = new Promise((resolve) => {
            beacon.addEventListener('created', (ev) => {
                resolve((ev as CustomEvent).detail);
            });
        });
        srv.send({ event: 'created', data: '00000000-0000-0000-0000-000000000000' });
        expect(await createdData).toEqual('00000000-0000-0000-0000-000000000000');

        const joinedData = new Promise((resolve) => {
            beacon.addEventListener('joined', (ev) => {
                resolve((ev as CustomEvent).detail);
            });
        });
        srv.send({ event: 'joined', data: ['00000000-0000-0000-0000-000000000000'] });
        expect(await joinedData).toEqual(['00000000-0000-0000-0000-000000000000']);

        const signalData = new Promise((resolve) => {
            beacon.addEventListener('signal', (ev) => {
                resolve((ev as CustomEvent).detail);
            });
        });
        srv.send({ event: 'signal', data: {
            peerId: '00000000-0000-0000-0000-000000000000',
            data: { foo: 'bar' },
        }});
        expect(await signalData).toEqual({
            peerId: '00000000-0000-0000-0000-000000000000',
            data: { foo: 'bar' },
        });
    });
});