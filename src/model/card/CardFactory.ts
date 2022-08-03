import { Inject, Service } from 'typedi';
import { Card, Props } from './Card';
import { PhenomenonFactory } from './phenomenon';
import { PlaneFactory } from './plane';

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
