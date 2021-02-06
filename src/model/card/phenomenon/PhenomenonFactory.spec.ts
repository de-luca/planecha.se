import { Container } from 'typedi';
import { PhenomenonFactory, Phenomenon } from '.';
import { InterplanarTunnel } from './special';
import type { Props } from '..';

const factory = Container.get(PhenomenonFactory);
const props: Props = {
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
};

describe('PhenomenonFactory.build', () => {
    it('builds a simple Phenomenon', () => {
        expect(factory.build(props)).toBeInstanceOf(Phenomenon);
    });

    it('builds a special Phenomenon', () => {
        props.id = '56e4874c-9d3d-4a1c-a027-186a33ce0da7';
        expect(factory.build(props)).toBeInstanceOf(InterplanarTunnel);
    });
});