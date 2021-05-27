import { Coordinates } from "../map/MapInterface";

export interface OnlineInterface {
    create(): Promise<string>;
    join(roomId: string): void;
    requestPlaneswalk(coordinates?: Coordinates): void;
}