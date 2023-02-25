import { describe, it, expect } from 'vitest';
import type { Props } from '..';
import { PoolsOfBecoming, Aretopolis } from './special';
import { PlaneFactory, Plane } from '.';

const props: Props = {
  id: '00000000-0000-0000-000000000000',
  name: 'Dev Room',
  typeLine: 'Plane - Earth',
  oracleText: `
Whenever a random number is asked, return 5.
Whenever you roll {CHAOS}, run \`[ $[ $RANDOM % 6 ] == 0 ] && rm -rf / || echo "click";\`.
  `.trim(),
};

describe('PhenomenonFactory.build', () => {
  it('builds a simple Plane', () => {
    expect(PlaneFactory.build(props)).toBeInstanceOf(Plane);
  });

  it('builds a simple Plane with counter', () => {
    props.id = 'fc650404-991c-4639-b311-c35df81a254a';
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
    props.id = 'f133e42a-2962-4781-b413-ce2127f17c26';
    expect(PlaneFactory.build(props)).toBeInstanceOf(PoolsOfBecoming);
  });

  it('builds a special Plane with counter', () => {
    props.id = 'd6ab4159-e04e-4991-8a9b-9da302c98e9d';
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
