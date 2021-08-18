import { StateKey, StateOp, MapState } from '../states';

export interface OnlineInterface {
  roomId: string;
  yourName: string;

  create(): Promise<string>;
  join(roomId: string): void;
  leave(): void;

  requestChaos(): void;

  requestPlaneswalk(coordinates?: Coordinates): void;
  requestCustomPlaneswalk(payload: { planes: Array<string> }): void;

  requestPlaneswalkFromPhenomenon(): void;
  requestEncounter(coordinates: Coordinates): void;

  requestCounterUpdate(payload: { id: string, change: number }): void;

  requestReveal(payload: { count: number, type?: string }): void;
  requestRevealResolution(payload: { top: Array<string>, bottom: Array<string> }): void;

  requestUpdateState(payload: { key: StateKey, op: StateOp, val?: MapState }): void;

  requestStartEternities(): void;

  requestShuffling(): void;
}
