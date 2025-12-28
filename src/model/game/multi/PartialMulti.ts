import { WallManager } from "@/model/wall";
import { getList } from "@/services/deckProvider";
import { Game } from "../Game";
import type { GameDump, GameSpecs } from "../GameInterface";

export class PartialMulti extends Game {
	public get specs(): GameSpecs {
		return { type: "multi" };
	}

	public planeswalk(): void {
		throw new Error("Read Only PartialMulti");
	}

	public addActivePlane(): void {
		throw new Error("Read Only PartialMulti");
	}

	public resolve(): void {
		throw new Error("Read Only PartialMulti");
	}

	public dump(): GameDump {
		return {
			specs: this.specs,
			hasStarted: this._hasStarted,
			wallStates: this._wallStates.dump(),
			deck: { cards: [], played: [] },
			active: this._active.map((c) => c.dump()),
			revealed:
				this._revealed === undefined
					? undefined
					: {
							relevant: this._revealed.relevant.map((c) => c.id),
							others: this._revealed.others.map((c) => c.id),
						},
		};
	}

	public restore(state: GameDump): void {
		this._hasStarted = state.hasStarted;
		this._wallStates = new WallManager(state.wallStates);
		this._active = getList(state.active);
		this._revealed =
			state.revealed === undefined
				? undefined
				: {
						relevant: getList(state.revealed.relevant),
						others: getList(state.revealed.others),
					};
	}
}
