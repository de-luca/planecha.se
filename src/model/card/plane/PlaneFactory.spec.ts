import { describe, it, expect } from 'vitest';
import type { Props } from '..';
import { PoolOfBecoming, Aretopolis } from './special';
import { PlaneFactory, Plane } from '.';

const props: Props = {
  id: '00000000-0000-0000-000000000000',
  oracleId: '00000000-0000-0000-000000000000',
  multiverseIds: [12345],
  name: 'Dev Room',
  scryfallUri: 'https://fake.tld/plane/dev-room',
  typeLine: 'Plane - Earth',
  oracleText: `
Whenever a random number is asked, return 5.
Whenever you roll {CHAOS}, run \`[ $[ $RANDOM % 6 ] == 0 ] && rm -rf / || echo "click";\`.
`.trim(),
  gathererUri: 'https://gatherer.tld/12345',
};

describe('PhenomenonFactory.build', () => {
  it('builds a simple Plane', () => {
    expect(PlaneFactory.build(props)).toBeInstanceOf(Plane);
  });

  it('builds a simple Plane with counter', () => {
    props.id = 'f63b82f9-ebc4-465c-b25e-5ee710525143';
    const plane = PlaneFactory.build(props);
    expect(plane).toBeInstanceOf(Plane);
    expect(plane['counter']).toEqual({
      name: 'Flame',
      value: 0,
      start: 0,
      max: null,
      reset: false,
    });
  });

  it('builds a special Plane', () => {
    props.id = '559007a6-c515-413a-8d3c-8ce1df0742ff';
    expect(PlaneFactory.build(props)).toBeInstanceOf(PoolOfBecoming);
  });

  it('builds a special Plane with counter', () => {
    props.id = 'd6dc655e-d8ef-443a-bb3e-46c7ca1555ba';
    const plane = PlaneFactory.build(props);
    expect(plane).toBeInstanceOf(Aretopolis);
    expect(plane['counter']).toEqual({
      name: 'Scroll',
      value: 0,
      start: 0,
      max: 10,
      reset: true,
    });
  });
});
