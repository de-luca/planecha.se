import shuffle from "lodash.shuffle";
import { Imgable } from "#/components/Imgable";
import type { Plane } from "#/model/card";
import { useMain } from "#/store/main";
import type { PickedLeft } from "#board/wall/reveal/types";

export abstract class Map extends Imgable {
	protected store = useMain();

	public get hasStarted(): boolean {
		return this.store.map.hasStarted;
	}

	public planeswalk(..._params: Array<unknown>): void {
		throw new Error("Implement Me!");
	}

	public customPlaneswalk(choices: PickedLeft): void {
		this.store.planeswalk({
			planes: choices.picked as Array<Plane>,
		});
		this.putBack({ picked: [], left: choices.left });
	}

	public putBack(choices: PickedLeft): void {
		const payload = {
			top: choices.picked,
			bottom: shuffle(choices.left),
		};

		this.store.resolveReveal(payload);
	}
}
