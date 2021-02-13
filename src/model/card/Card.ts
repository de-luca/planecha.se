import type { Props } from '.';

export abstract class Card {
    protected id: string;

    protected oracleId: string;

    protected multiverseIds: Array<number>;

    protected name: string;

    protected scryfallUri: string;

    protected typeLine: string;

    protected oracleText: string;

    protected gathererUri: string;

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
}
