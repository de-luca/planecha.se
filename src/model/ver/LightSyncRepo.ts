import { diff, type Patch } from "@/utils/delta";
import type { GameDump } from "../game";
import { Repo } from "./Repo";

export class LightSyncRepo extends Repo {
	private stage?: GameDump;

	public commit(event: string, newVersion: GameDump): Patch {
		super.commit(event, newVersion);

		const exportLight = {
			...newVersion,
			deck: { cards: [], played: [] },
		};
		const patch = {
			event,
			delta: diff(this.stage, exportLight),
		};
		this.stage = exportLight;
		return patch;
	}

	public apply(): void {
		// NOOP
	}
}
