import { WallManager } from "#/model/wall";
import { getCardList } from "#/services/cardProvider";
import { Game } from "../Game";
import { type GameDump, type GameSpecs, GameType } from "../GameInterface";

export class PartialMulti extends Game {
	public get specs(): GameSpecs {
		return { type: GameType.MULTI };
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
		this._active = getCardList(state.active);
		this._revealed =
			state.revealed === undefined
				? undefined
				: {
						relevant: getCardList(state.revealed.relevant),
						others: getCardList(state.revealed.others),
					};
	}
}
