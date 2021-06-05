import type { Props } from '.';
import { CardInterface } from './CardInterface';

export abstract class Card implements CardInterface {
    public id: string;
    public oracleId: string;
    public multiverseIds: Array<number>;
    public name: string;
    public scryfallUri: string;
    public typeLine: string;
    public oracleText: string;
    public gathererUri: string;

    public constructor(props: Props) {
      this.id = props.id;
      this.oracleId = props.oracleId;
      this.multiverseIds = props.multiverseIds;
      this.name = props.name;
      this.scryfallUri = props.scryfallUri;
      this.typeLine = props.typeLine;
      this.oracleText = props.oracleText;
      this.gathererUri = props.gathererUri;
    }

    public abstract get type(): string;
    
    public abstract enter(): void;
    public abstract leave(): void;
}
