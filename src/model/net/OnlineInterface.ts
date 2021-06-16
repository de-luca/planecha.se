import { Card } from "../card";
import { Coordinates } from "../map/MapInterface";

export interface OnlineInterface {
    create(): Promise<string>;
    join(roomId: string): void;
    requestChaos(): void;
    requestPlaneswalk(coordinates?: Coordinates): void;
    requestCustomPlaneswalk(payload: { planes: Array<string> }): void;
    requestCounterUpdate(payload: { id: string, change: number }): void;
    requestRevealResolution(payload: { top: Array<string>, bottom: Array<string> }): void;
    requestShuffling(payload: { active: Array<string>, deck: Array<string> }): void;
}