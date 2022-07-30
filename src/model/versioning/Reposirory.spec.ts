import { diff } from '@n1ru4l/json-patch-plus';
import { describe, it, expect, test } from 'vitest';
import { Exported, MapType } from '../map';
import { Repository } from './Repository';

const exported: Exported = {
  active: [],
  deck: { cards: [], played: [] },
  hasStarted: true,
  specs: { type: MapType.CLASSIC },
  wallStates: [],
};

describe('Repository.setStash/Repository.getStash', () => {
  it('returns undefined when stash has never been set', () => {
    const repository = new Repository();
    expect(repository.getStash()).toBeUndefined();
  });

  it('returns an exported when stash has been set', () => {
    const repository = new Repository();
    repository.setStash(exported);
    expect(repository.getStash()).toEqual(exported);
  });
});

describe('Repository.apply', () => {
  it('returns an increased head pointer', () => {
    const repository = new Repository();
    expect(repository.apply({ event: 'test' })).toEqual(0);
    expect(repository.apply({ event: 'test' })).toEqual(1);
    expect(repository.apply({ event: 'test' })).toEqual(2);
  });
});

describe('Repository.checkout', () => {
  it('returns an increased head pointer', () => {
    const repository = new Repository();

    repository.apply({
      event: 'test',
      delta: diff({ left: undefined, right: exported }),
    });

    const v1: Exported = {
      ...exported,
      active: [{ id: '00000000-0000-0000-0000-000000000000' }],
    };
    repository.apply({
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
    repository.apply({
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
    repository.apply({
      event: 'test',
      delta: diff({ left: v2, right: v3 }),
    });

    expect(repository.checkout(2)).toEqual(v2);
  });
});
