import { Card } from "../card";
import { Coordinates } from "../map/MapInterface";

export interface OnlineInterface {
    roomId: string;
    yourName: string;

    create(): Promise<string>;
    join(roomId: string): void;
    leave(): void;

    requestChaos(): void;
    requestPlaneswalk(coordinates?: Coordinates): void;
    requestCustomPlaneswalk(payload: { planes: Array<string> }): void;

    requestCounterUpdate(payload: { id: string, change: number }): void;
    
    requestReveal(payload: { count: number, type?: string }): void;
    requestRevealResolution(payload: { top: Array<string>, bottom: Array<string> }): void;
    
    requestShuffling(): void;
}