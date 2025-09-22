import { type Patch, diff, patch } from "@/utils/delta";
import type { GameDump } from "../game";
import type { Clone, MaybeDump, RepoInterface } from "./RepoInterface";

export class Repo implements RepoInterface {
	private static readonly UNSTABLE_EVENT = ["reveal", "updateWallState"];

	private _stage?: GameDump;
	private _head: number;
	private _patches: Array<Patch>;

	public constructor(clone?: Clone) {
		this._stage = undefined;
		this._head = clone?.head ?? -1;
		this._patches = clone?.patches ?? [];
	}

	public get head(): number {
		return this._head;
	}

	public getStableIndex(from?: number): number {
		let i = from ?? this._head - 1;
		while (Repo.UNSTABLE_EVENT.includes(this._patches[i].event)) {
			i--;
		}
		return i;
	}

	public commit(event: string, newVersion: GameDump): Patch {
		const patch = {
			event,
			delta: diff(this._stage, newVersion),
		};
		this._stage = newVersion;
		this.updateIndex(patch);
		return patch;
	}

	public apply(p: Patch): void {
		if (p.delta) {
			this._stage = patch<MaybeDump, GameDump>(this._stage ?? {}, p.delta);
		}
		this.updateIndex(p);
	}

	private updateIndex(patch: Patch): void {
		if (this._head !== this._patches.length - 1) {
			this._patches.splice(this._head + 1, this._patches.length - this._head);
		}
		this._head = this._patches.push(patch) - 1;
	}

	public checkout(index: number): GameDump {
		let base = {};
		for (let i = 0; i <= index; i++)
			if (this._patches[i].delta) {
				base = patch<MaybeDump, GameDump>(base, this._patches[i].delta!);
			}
		this._head = index;
		this._stage = base as GameDump;
		return base as GameDump;
	}

	public clone(): Clone {
		return {
			head: this._head,
			patches: this._patches,
		};
	}
}
