import { Card, Props } from './Card';
import { PhenomenonFactory } from './phenomenon';
import { PlaneFactory } from './plane';

export class CardFactory {
  public static build(props: Props): Card {
    if (props.typeLine === 'Phenomenon') {
      return PhenomenonFactory.build(props);
    }

    return PlaneFactory.build(props);
  }
}
