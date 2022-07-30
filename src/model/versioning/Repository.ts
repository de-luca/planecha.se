import { Delta, patch } from "@n1ru4l/json-patch-plus";
import { Exported } from "../map";
import { Patch } from "./Patch";

export interface RepositoryInterface {
  getStash(): Exported | undefined;
  setStash(exported: Exported): void;
  apply(patch: Patch): number;
  checkout(index: number): Exported;
}

export class Repository implements RepositoryInterface {
  private stash?: Exported;
  private head: number;
  private patches: Array<Patch>;

  public constructor() {
    this.stash = undefined;
    this.head = -1;
    this.patches = [];
  }

  public getStash(): Exported | undefined {
    return this.stash;
  }

  public setStash(exported: Exported): void {
    this.stash = exported;
  }

  public apply(patch: Patch): number {
    if (this.head !== (this.patches.length - 1)) {
      this.patches.splice(this.head, this.patches.length - this.head);
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
          delta: this.patches[i].delta as Delta,
        });
      }
    }
    this.head = index;
    return base as Exported;
  }
}
