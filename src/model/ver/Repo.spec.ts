import { diff } from '@n1ru4l/json-patch-plus';
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

describe('Repo.setStash/Repo.getStash', () => {
  it('returns undefined when stash has never been set', () => {
    const repo = new Repo();
    expect(repo.getStash()).toBeUndefined();
  });

  it('returns an exported when stash has been set', () => {
    const repo = new Repo();
    repo.setStash(exported);
    expect(repo.getStash()).toEqual(exported);
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

    repo.apply({
      event: 'test',
      delta: diff({ left: undefined, right: exported }),
    });

    const v1: Exported = {
      ...exported,
      active: [{ id: '00000000-0000-0000-0000-000000000000' }],
    };
    repo.apply({
      event: 'test',
      delta: diff({ left: exported, right: v1 }),
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
      delta: diff({ left: v1, right: v2 }),
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
      delta: diff({ left: v2, right: v3 }),
    });

    expect(repo.checkout(2)).toEqual(v2);
  });
});
