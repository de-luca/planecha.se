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
            imageUris: {
                small: 'https://fake.tld/plane/dev-room/img?small',
                normal: 'https://fake.tld/plane/dev-room/img?normal',
                large: 'https://fake.tld/plane/dev-room/img?large',
                png: 'https://fake.tld/plane/dev-room/img?png',
                art_crop: 'https://fake.tld/plane/dev-room/img?acrop',
                border_crop: 'https://fake.tld/plane/dev-room/img?bcrop',
            },
            typeLine: 'Plane - Earth',
            oracleText: `
Whenever a random number is asked, return 5.
Whenever you roll {CHAOS}, run \`[ $[ $RANDOM % 6 ] == 0 ] && rm -rf / || echo "click";\`.
`.trim(),
            gathererUri: 'https://gatherer.tld/12345',
        })).toBeInstanceOf(Plane.Plane);
    });

    it('builds a Phenomenon', () => {
        expect(factory.build({
            id: '00000000-0000-0000-000000000000',
            oracleId: '00000000-0000-0000-000000000000',
            multiverseIds: [12345],
            name: 'Sip Coffee',
            scryfallUri: 'https://fake.tld/phenomenon/sip-coffee',
            imageUris: {
                small: 'https://fake.tld/phenomenon/sip-coffee/img?small',
                normal: 'https://fake.tld/phenomenon/sip-coffee/img?normal',
                large: 'https://fake.tld/phenomenon/sip-coffee/img?large',
                png: 'https://fake.tld/phenomenon/sip-coffee/img?png',
                art_crop: 'https://fake.tld/phenomenon/sip-coffee/img?acrop',
                border_crop: 'https://fake.tld/phenomenon/sip-coffee/img?bcrop',
            },
            typeLine: 'Phenomenon',
            oracleText: 'When you encounter Sip Coffee, take a sip of coffee.',
            gathererUri: 'https://gatherer.tld/12345',
        })).toBeInstanceOf(Phenomenon.Phenomenon);
    });
});