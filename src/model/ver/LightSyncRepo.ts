import { type Patch, diff } from "#/utils/delta";
import type { Exported } from "../map";
import { Repo } from "./Repo";

export class LightSyncRepo extends Repo {
	private stage?: Exported;

	public commit(event: string, newVersion: Exported): Patch {
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
