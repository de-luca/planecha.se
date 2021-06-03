import { Log } from '@/store/states/map';
import type { Props } from '.';

export abstract class Card {
    public id: string;
    public oracleId: string;
    public multiverseIds: Array<number>;
    public name: string;
    public scryfallUri: string;
    public typeLine: string;
    public oracleText: string;
    public gathererUri: string;

    protected constructor(props: Props) {
      this.id = props.id;
      this.oracleId = props.oracleId;
      this.multiverseIds = props.multiverseIds;
      this.name = props.name;
      this.scryfallUri = props.scryfallUri;
      this.typeLine = props.typeLine;
      this.oracleText = props.oracleText;
      this.gathererUri = props.gathererUri;
    }

    public abstract type(): string;
}
