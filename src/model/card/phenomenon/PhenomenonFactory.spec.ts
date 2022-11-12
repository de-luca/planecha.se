import { describe, it, expect } from 'vitest';
import type { Props } from '..';
import { InterplanarTunnel } from './special';
import { PhenomenonFactory, Phenomenon } from '.';

const props: Props = {
  id: '00000000-0000-0000-000000000000',
  oracleId: '00000000-0000-0000-000000000000',
  multiverseIds: [12345],
  name: 'Sip Coffee',
  scryfallUri: 'https://fake.tld/phenomenon/sip-coffee',
  typeLine: 'Phenomenon',
  oracleText: 'When you encounter Sip Coffee, take a sip of coffee.',
  gathererUri: 'https://gatherer.tld/12345',
};

describe('PhenomenonFactory.build', () => {
  it('builds a simple Phenomenon', () => {
    expect(PhenomenonFactory.build(props)).toBeInstanceOf(Phenomenon);
  });

  it('builds a special Phenomenon', () => {
    props.id = '56e4874c-9d3d-4a1c-a027-186a33ce0da7';
    expect(PhenomenonFactory.build(props)).toBeInstanceOf(InterplanarTunnel);
  });
});
