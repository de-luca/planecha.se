import { Exported } from '../map';
import * as Payload from './payloads';

export interface OnlineInterface {
  gameId: string;
  yourName: string;

  create(): Promise<string>;
  join(gameId: string): Promise<void>;
  leave(): void;

  requestChaos(): void;

  requestPlaneswalk(payload: Payload.Planeswalk): void;
  requestCustomPlaneswalk(payload: Payload.CustomPlaneswalk): void;

  requestEncounter(payload: Payload.Encounter): void;
  requestResolve(): void;

  requestCounterUpdate(payload: Payload.Counters): void;

  requestReveal(payload: Payload.Reveal): void;
  requestResolveReveal(payload: Payload.ResolveReveal): void;

  requestUpdateWallState(payload: Payload.UpdateWallState): void;

  requestStartGame(): void;

  requestUndo(state: Payload.Undo): void;

  requestShuffling(): void;
}
