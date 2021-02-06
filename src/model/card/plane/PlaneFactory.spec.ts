import { Container } from 'typedi';
import { PlaneFactory, Plane } from '.';
import { PoolOfBecoming, Aretopolis } from './special';
import type { Props } from '..';

const factory = Container.get(PlaneFactory);
const props: Props = {
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
};

describe('PhenomenonFactory.build', () => {
    it('builds a simple Plane', () => {
        expect(factory.build(props)).toBeInstanceOf(Plane);
    });

    it('builds a simple Plane with counter', () => {
        props.id = 'f63b82f9-ebc4-465c-b25e-5ee710525143';
        const plane = factory.build(props);
        expect(plane).toBeInstanceOf(Plane);
        expect((plane as any).counter).toEqual({
            name: "Flame",
            value: 0,
            start: 0,
            max: null,
            reset: false,
        });
    });

    it('builds a special Plane', () => {
        props.id = '559007a6-c515-413a-8d3c-8ce1df0742ff';
        expect(factory.build(props)).toBeInstanceOf(PoolOfBecoming);
    });

    it('builds a special Plane with counter', () => {
        props.id = 'd6dc655e-d8ef-443a-bb3e-46c7ca1555ba';
        const plane = factory.build(props);
        expect(plane).toBeInstanceOf(Aretopolis);
        expect((plane as any).counter).toEqual({
            name: "Scroll",
            value: 0,
            start: 0,
            max: 10,
            reset: true,
        });
    });
});