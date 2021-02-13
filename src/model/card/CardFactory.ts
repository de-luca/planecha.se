import { Inject, Service } from 'typedi';
import { Card } from './Card';
import { PhenomenonFactory } from './phenomenon';
import { PlaneFactory } from './plane';

interface CounterProps {
    name: string;
    value: number;
    start: number;
    max: number | null;
    reset: boolean;
}

export interface Props {
    id: string;
    oracleId: string;
    multiverseIds: Array<number>;
    name: string;
    scryfallUri: string;
    typeLine: string;
    oracleText: string;
    gathererUri: string;
    counter?: CounterProps;
}

@Service()
export class CardFactory {
    @Inject(() => PlaneFactory)
    private planeFactory: PlaneFactory;

    @Inject(() => PhenomenonFactory)
    private phenomenonFactory: PhenomenonFactory;

    public build(props: Props): Card {
      if (props.typeLine === 'Phenomenon') {
        return this.phenomenonFactory.build(props);
      }

      return this.planeFactory.build(props);
    }
}
