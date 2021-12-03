import { promisify } from '../../../tests/promisify';
import { getEnv } from '@/services/getEnv';
import { Beacon, SignalData, SignalPayload } from './Beacon';

jest.mock('@/services/getEnv');

describe('Beacon.constructor', () => {
  it('starts a websocket and emit ready event', async() => {
    await expect(new Promise<Beacon>((resolve) => {
      const beacon = new Beacon();
      beacon.addEventListener('ready', () => resolve(beacon));
    })).resolves.not.toThrow();
  });
});

describe('Beacon.check', () => {
  it('returns true if server is available', async() => {
    expect(await Beacon.check()).toEqual(true);
  });

  it('returns false if server is unavailable', async() => {
    (getEnv as jest.Mock).mockImplementationOnce(() => 'ws://DEAD');
    expect(await Beacon.check()).toEqual(false);
  });
});

describe('Beacon.create', () => {
  it('sends a create payload and receive back a payload', async() => {
    const beacon = new Beacon();
    await promisify<void>(beacon, 'ready');
    beacon.create();
    const room = await promisify<string>(beacon, 'created') as string;
    expect(room).toEqual(expect.any(String));
  });
});

describe('Beacon.join', () => {
  it('sends a join event and receive back a payload', async() => {
    const beacon = new Beacon();
    await promisify<void>(beacon, 'ready');
    beacon.create();
    const room = await promisify<string>(beacon, 'created') as string;
    beacon.join(room);
    const peers = await promisify(beacon, 'joined');
    expect(peers).toEqual(expect.any(Array));
  });

  it('sends an unknown join event and receive back an error', async() => {
    const beacon = new Beacon();
    await promisify<void>(beacon, 'ready');
    beacon.join('00000000-0000-0000-0000-000000000000');
    const error = await promisify(beacon, 'error');
    expect(error).toEqual('ROOM_DOES_NOT_EXISTS');
  });
});

describe('Beacon.signal', () => {
  it('sends a signal event and receive signal payload', async() => {
    const b1 = new Beacon();
    const b2 = new Beacon();
    await Promise.all([
      promisify<void>(b1, 'ready'),
      promisify<void>(b2, 'ready'),
    ]);

    b1.create();
    const room = await promisify<string>(b1, 'created') as string;
    b2.join(room);
    const peers = await promisify<Array<string>>(b2, 'joined') as Array<string>;

    const signal: SignalData = {
      type: 'offer',
      data: { foo: 'bar' },
    };

    b2.signal(peers[0], signal);
    const payload = await promisify<SignalPayload>(b1, 'signal') as SignalPayload;
    expect(payload.data).toEqual(signal);
  });
});
