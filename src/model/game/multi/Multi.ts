import { Deck } from "#/model/deck/Deck";
import { WallManager } from "#/model/wall";
import { type Patch, patch } from "#/utils/delta";
import { Game, type GameProps } from "../Game";
import {
	type AddActivePlaneInput,
	type GameDump,
	type GameSpecs,
	GameType,
	type PlaneswalkInput,
	type ResolveInput,
} from "../GameInterface";
import { PartialMulti } from "./PartialMulti";

export class Multi extends Game {
	public readonly mateStates: Map<string, PartialMulti>;

	public constructor(props: GameProps) {
		super(props);
		this.mateStates = new Map();
		this._active = props.active ?? [this._deck.drawPlane()];
	}

	public get specs(): GameSpecs {
		return { type: GameType.MULTI };
	}

	public planeswalk(input: PlaneswalkInput): void {
		for (const c of this._active) {
			c.leave();
		}
		this._deck.setPlayed(...this._active);

		if ("planes" in input) {
			this._active = input.planes;
		} else {
			this._active = [this._deck.draw()];
		}

		for (const c of this._active) {
			c.enter(this._wallStates, input.initiator);
		}
	}

	public addActivePlane(input: AddActivePlaneInput): void {
		this._active.push(input.plane);
		input.plane.enter(this._wallStates, input.initiator);
	}

	public removeMate(peer: string): void {
		this.mateStates.delete(peer);
	}

	public apply(p: Patch, peer: string): void {
		if (p.event === "__init__") {
			const game = new PartialMulti({
				deck: new Deck([]),
				wallStates: new WallManager(),
			});
			game.restore(patch({}, p.delta!));
			if (game.hasStarted) {
				this.start();
			}
			this.mateStates.set(peer, game);
			return;
		}

		this.mateStates.get(peer)?.apply(p, peer);
	}

	public resolve(input: ResolveInput): void {
		this.planeswalk(input);
	}

	public dump(): GameDump {
		return {
			...super.dump(),
			deck: { cards: [], played: [] },
		};
	}
}
