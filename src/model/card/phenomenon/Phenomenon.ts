import type { Props } from '../CardFactory';
import { Card } from '../Card';

export class Phenomenon extends Card {
  // eslint-disable-next-line no-useless-constructor
  public constructor(props: Props) {
    super(props);
  }

  public type(): string {
    return 'phenomenon';
  }
}
