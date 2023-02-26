import { describe, it, expect } from 'vitest';
import { Exported, MapType } from '../map';
import { Repo } from './Repo';

const exported: Exported = {
  active: [],
  deck: { cards: [], played: [] },
  hasStarted: true,
  specs: { type: MapType.CLASSIC },
  wallStates: [],
};

describe('Repo.getStableIndex', () => {
  it('returns the default index if stable', () => {
    const repo = new Repo();
    repo.apply({ event: 'test' });
    repo.apply({ event: 'test' });
    repo.apply({ event: 'test' });
    expect(repo.getStableIndex()).toEqual(1);
  });

  it('returns the first stable index', () => {
    const repo = new Repo();
    repo.apply({ event: 'test' });
    repo.apply({ event: 'reveal' });
    repo.apply({ event: 'test' });
    expect(repo.getStableIndex()).toEqual(0);
  });

  it('returns the given index if stable', () => {
    const repo = new Repo();
    repo.apply({ event: 'test' });
    repo.apply({ event: 'test' });
    repo.apply({ event: 'test' });
    expect(repo.getStableIndex(1)).toEqual(1);
  });

  it('returns the first stable index from given index', () => {
    const repo = new Repo();
    repo.apply({ event: 'test' });
    repo.apply({ event: 'reveal' });
    repo.apply({ event: 'test' });
    expect(repo.getStableIndex(1)).toEqual(0);
  });
});

describe('Repo.commit', () => {
  it('returns an a patch after applying it', () => {
    const repo = new Repo();
    const patch = repo.commit('test', exported);
    expect(patch.event).toEqual('test');
    expect(patch.delta).not.toBeUndefined();
  });
});

describe('Repo.apply', () => {
  it('returns an increased head pointer', () => {
    const repo = new Repo();
    expect(repo.apply({ event: 'test' })).toEqual(0);
    expect(repo.apply({ event: 'test' })).toEqual(1);
    expect(repo.apply({ event: 'test' })).toEqual(2);
  });
});

describe('Repo.checkout', () => {
  it('returns an increased head pointer', () => {
    const repo = new Repo();

    const v0 = { ...exported };
    repo.apply({
      event: 'test',
      delta: Repo.diff(undefined, v0),
    });

    const v1: Exported = {
      ...exported,
      active: [{ id: '00000000-0000-0000-0000-000000000000' }],
    };
    repo.apply({
      event: 'test',
      delta: Repo.diff(v0, v1),
    });

    const v2: Exported = {
      ...exported,
      active: [
        { id: '00000000-0000-0000-0000-000000000000' },
        { id: '00000000-0000-0000-0000-000000000001' },
      ],
    };
    repo.apply({
      event: 'test',
      delta: Repo.diff(v1, v2),
    });

    const v3: Exported = {
      ...exported,
      active: [
        { id: '00000000-0000-0000-0000-000000000000' },
        { id: '00000000-0000-0000-0000-000000000001' },
        { id: '00000000-0000-0000-0000-000000000002' },
      ],
    };
    repo.apply({
      event: 'test',
      delta: Repo.diff(v2, v3),
    });

    expect(repo.checkout(2)).toEqual(v2);
  });
});
