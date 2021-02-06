import { Service } from 'typedi';
import { Card } from ".";
import { PhenomenonFactory } from "./phenomenon";
import { PlaneFactory } from "./plane"

interface CounterProps {
    name: string;
    value: number;
    start: number;
    max: number | null;
    reset: boolean;
}

interface ImageCollectionProps {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
}

export interface Props {
    id: string;
    oracleId: string;
    multiverseIds: Array<number>;
    name: string;
    scryfallUri: string;
    imageUris: ImageCollectionProps;
    typeLine: string;
    oracleText: string;
    gathererUri: string;
    counter?: CounterProps;
}

@Service()
export class CardFactory {
    public constructor(
        private planeFactory: PlaneFactory,
        private phenomenonFactory: PhenomenonFactory,
    ) { }

    public build(props: Props): Card {
        if (props.typeLine === 'Phenomenon') {
            return this.phenomenonFactory.build(props);
        }

        return this.planeFactory.build(props);
    }
}