import { Props } from '../Card';
import { Phenomenon } from './Phenomenon';
import * as Special from './special';

type SpecialConstructor = { new(props: Props): Phenomenon };

export class PhenomenonFactory {
  private static readonly specials: Map<string, SpecialConstructor> = new Map([
    ['6dc67a65-31bf-4535-9e02-8f6d6ecefde5', Special.ChaoticAether],
    ['7812174b-2dc1-43e8-b98f-639905e20ab7', Special.InterplanarTunnel],
    ['aa166578-b13b-4adb-a78e-d5183e987112', Special.SpatialMerging],
  ]);

  public static build(props: Props): Phenomenon {
    return new (this.specials.get(props.id) ?? Phenomenon)(props);
  }
}
