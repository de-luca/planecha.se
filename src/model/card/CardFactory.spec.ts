import { describe, it, expect } from 'vitest';
import { CardFactory, Plane, Phenomenon } from '.';

describe('PhenomenonFactory.build', () => {
  it('builds a Plane', () => {
    expect(CardFactory.build({
      id: '00000000-0000-0000-000000000000',
      name: 'Dev Room',
      typeLine: 'Plane - Earth',
      oracleText: `
Whenever a random number is asked, return 5.
Whenever you roll {CHAOS}, run \`[ $[ $RANDOM % 6 ] == 0 ] && rm -rf / || echo "click";\`.
`.trim(),
    })).toBeInstanceOf(Plane);
  });

  it('builds a Phenomenon', () => {
    expect(CardFactory.build({
      id: '00000000-0000-0000-000000000000',
      name: 'Sip Coffee',
      typeLine: 'Phenomenon',
      oracleText: 'When you encounter Sip Coffee, take a sip of coffee.',
    })).toBeInstanceOf(Phenomenon);
  });
});
