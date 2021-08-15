import { Revealer } from "./Revealer";

/**
 * Control and store the state of the various modals
 * and asynchronus controls linked to the Map.
 */
export class State {
  private _hasStarted: boolean;
  private _encounterWall?: unknown;
  private _phenomenon?: unknown
  private _revealer?: Revealer;

  public constructor(hasStarted: boolean) {
    this._hasStarted = hasStarted;
  }

  public get revealer(): Revealer | undefined {
    return this._revealer;
  }

  public openRevealer(revealer: Revealer): void {
    this._revealer = revealer;
  }

  public closeRevealer(): void {
    this._revealer = undefined;
  }
}
