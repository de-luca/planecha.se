import { Props } from ".";

interface ImageCollection {
    small: string;
    normal: string;
    large: string;
    png: string;
    artCrop: string;
    borderCrop: string;
}

export abstract class Card {
    protected id: string;
    protected oracleId: string;
    protected multiverseIds: Array<number>;
    protected name: string;
    protected scryfallUri: string;
    protected imageUris: ImageCollection;
    protected typeLine: string;
    protected oracleText: string;
    protected gathererUri: string;

    protected constructor(props: Props) {
        this.id = props.id;
        this.oracleId = props.oracleId;
        this.multiverseIds = props.multiverseIds;
        this.name = props.name;
        this.scryfallUri = props.scryfallUri;
        this.imageUris = {
            small: props.imageUris.small,
            normal: props.imageUris.normal,
            large: props.imageUris.large,
            png: props.imageUris.png,
            artCrop: props.imageUris.art_crop,
            borderCrop: props.imageUris.border_crop,
        };
        this.typeLine = props.typeLine;
        this.oracleText = props.oracleText;
        this.gathererUri = props.gathererUri;
    }
}