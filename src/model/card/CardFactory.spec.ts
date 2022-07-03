import { describe, it, expect } from 'vitest';
import { Container } from 'typedi';
import { CardFactory, Plane, Phenomenon } from '.';

const factory = Container.get(CardFactory);

describe('PhenomenonFactory.build', () => {
  it('builds a Plane', () => {
    expect(factory.build({
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
    })).toBeInstanceOf(Plane);
  });

  it('builds a Phenomenon', () => {
    expect(factory.build({
      id: '00000000-0000-0000-000000000000',
      oracleId: '00000000-0000-0000-000000000000',
      multiverseIds: [12345],
      name: 'Sip Coffee',
      scryfallUri: 'https://fake.tld/phenomenon/sip-coffee',
      typeLine: 'Phenomenon',
      oracleText: 'When you encounter Sip Coffee, take a sip of coffee.',
      gathererUri: 'https://gatherer.tld/12345',
    })).toBeInstanceOf(Phenomenon);
  });
});
