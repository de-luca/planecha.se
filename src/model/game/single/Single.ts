import { Game, type GameProps } from "../Game";
import type {
	AddActivePlaneInput,
	GameSpecs,
	PlaneswalkInput,
	ResolveInput,
} from "../GameInterface";

export class Single extends Game {
	public constructor(props: GameProps) {
		super(props);
		this._active = props.active ?? [this._deck.drawPlane()];
	}

	public get specs(): GameSpecs {
		return { type: "single" };
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

	public resolve(input: ResolveInput): void {
		this.planeswalk(input);
	}
}
