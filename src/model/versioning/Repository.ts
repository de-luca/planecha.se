import cloneDeep from "lodash.clonedeep";
import { Delta, patch } from "@n1ru4l/json-patch-plus";
import { Exported } from "../map";
import { Patch } from "./Patch";

export interface Clone {
  head: number;
  patches: Array<Patch>;
}

export interface RepositoryInterface {
  getStash(): Exported | undefined;
  setStash(exported: Exported): void;
  getHead(): number;
  apply(patch: Patch): number;
  checkout(index: number): Exported;
  clone(): Clone;
}

export class Repository implements RepositoryInterface {
  private stash?: Exported;
  private head: number;
  private patches: Array<Patch>;

  public constructor(clone?: Clone) {
    this.stash = undefined;
    this.head = clone?.head ?? -1;
    this.patches = clone?.patches ?? [];
  }

  public getStash(): Exported | undefined {
    return this.stash;
  }

  public setStash(exported: Exported): void {
    this.stash = exported;
  }

  public getHead(): number {
    return this.head;
  }

  public apply(patch: Patch): number {
    if (this.head !== (this.patches.length - 1)) {
      this.patches.splice(this.head + 1, this.patches.length - this.head);
    }
    this.head = this.patches.push(patch) - 1;
    return this.head;
  }

  public checkout(index: number): Exported {
    let base = {};
    for (let i = 0; i <= index; i++) {
      if (this.patches[i].delta) {
        base = patch({
          left: base,
          delta: cloneDeep<Delta>(this.patches[i].delta as Delta),
        });
      }
    }
    this.head = index;
    return base as Exported;
  }

  public clone(): Clone {
    return {
      head: this.head,
      patches: this.patches,
    };
  }
}
