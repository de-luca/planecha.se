import { Service } from 'typedi';
import type { Props } from '../CardFactory';
import { Phenomenon } from './Phenomenon';
import * as Special from './special';

type SpecialConstructor = { new(props: Props): Phenomenon };

@Service()
export class PhenomenonFactory {
    private static readonly specials: Map<string, SpecialConstructor> = new Map([
      ['42ecb371-53aa-4368-8ddd-88ae8e90ae0c', Special.ChaoticAether],
      ['56e4874c-9d3d-4a1c-a027-186a33ce0da7', Special.InterplanarTunnel],
      ['de44957b-3dcb-45db-a6a7-b5c6e64b582a', Special.SpatialMerging],
    ]);

    public build(props: Props): Phenomenon {
      return new (PhenomenonFactory.specials.get(props.id) ?? Phenomenon)(props);
    }
}
