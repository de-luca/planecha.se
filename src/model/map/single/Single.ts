import { Map, type MapProps } from "../Map";
import {
	type AddActivePlaneInput,
	type MapSpecs,
	MapType,
	type PlaneswalkInput,
	type ResolveInput,
} from "../MapInterface";

export class Single extends Map {
	public constructor(props: MapProps) {
		super(props);
		this._active = props.active ?? [this._deck.drawPlane()];
	}

	public get specs(): MapSpecs {
		return { type: MapType.SINGLE };
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
