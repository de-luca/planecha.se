import { diff, type Patch } from "@/utils/delta";
import type { GameDump } from "../game";
import { Repo } from "./Repo";

export class LightSyncRepo extends Repo {
	private stage?: GameDump;

	public commit(event: string, stable: boolean, newVersion: GameDump): Patch {
		super.commit(event, stable, newVersion);

		const exportLight = {
			...newVersion,
			deck: { cards: [], played: [] },
		};
		this.stage = exportLight;
		return {
			event,
			stable,
			delta: diff(this.stage, exportLight),
		};
	}

	public apply(): void {
		// NOOP
	}
}
