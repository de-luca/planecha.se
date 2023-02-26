import cloneDeep from 'lodash.clonedeep';
import { Delta, diff, patch } from '@n1ru4l/json-patch-plus';
import type { Exported } from '../map';
import type { Patch } from './Patch';

export interface Clone {
  head: number;
  patches: Array<Patch>;
}

export interface RepoInterface {
  head: number;
  getStableIndex(index?: number): number;
  commit(event: string, newVersion: Exported): Patch;
  apply(patch: Patch): number;
  checkout(index: number): Exported;
  clone(): Clone;
}

type MaybeExported = Exported | Record<string, never> | undefined;

export class Repo implements RepoInterface {
  private static readonly UNSTABLE_EVENT = ['reveal', 'updateWallState'];

  private _stage?: Exported;
  private _head: number;
  private _patches: Array<Patch>;

  public constructor(clone?: Clone) {
    this._stage = undefined;
    this._head = clone?.head ?? -1;
    this._patches = clone?.patches ?? [];
  }

  public static diff(a: MaybeExported, b: MaybeExported): Delta {
    return diff({ left: a, right: b });
  }

  public static patch(base: NonNullable<MaybeExported>, delta: Delta): Exported {
    return patch({ left: base, delta: cloneDeep(delta) }) as Exported;
  }

  public get head(): number {
    return this._head;
  }

  public getStableIndex(from?: number): number {
    let i = from ?? (this._head - 1);
    while (Repo.UNSTABLE_EVENT.includes(this._patches[i].event)) {
      i--;
    }
    return i;
  }

  public commit(event: string, newVersion: Exported): Patch {
    const patch = {
      event,
      delta: Repo.diff(this._stage, newVersion),
    };
    this._stage = newVersion;
    this.apply(patch, false);
    return patch;
  }

  public apply(patch: Patch, setStage = true): number {
    if (this._head !== (this._patches.length - 1)) {
      this._patches.splice(this._head + 1, this._patches.length - this._head);
    }
    if (setStage && patch.delta) {
      this._stage = Repo.patch(this._stage ?? {}, patch.delta);
    }
    this._head = this._patches.push(patch) - 1;
    return this._head;
  }

  public checkout(index: number): Exported {
    let base = {};
    for (let i = 0; i <= index; i++) {
      if (this._patches[i].delta) {
        base = Repo.patch(
          base,
          cloneDeep<Delta>(this._patches[i].delta!),
        );
      }
    }
    this._head = index;
    this._stage = base as Exported;
    return base as Exported;
  }

  public clone(): Clone {
    return {
      head: this._head,
      patches: this._patches,
    };
  }
}
