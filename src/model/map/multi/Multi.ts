import { Deck } from "#/model/deck/Deck";
import { WallManager } from "#/model/wall";
import { type Patch, patch } from "#/utils/delta";
import { Map as BaseMap, type MapProps } from "../Map";
import {
	type AddActivePlaneInput,
	type Exported,
	type MapSpecs,
	MapType,
	type PlaneswalkInput,
	type ResolveInput,
} from "../MapInterface";
import { LightMap } from "./LightMap";

export class Multi extends BaseMap {
	public readonly mateStates: Map<string, LightMap>;

	public constructor(props: MapProps) {
		super(props);
		this.mateStates = new Map();
		this._active = props.active ?? [this._deck.drawPlane()];
	}

	public get specs(): MapSpecs {
		return { type: MapType.MULTI };
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
			const map = new LightMap({
				deck: new Deck([]),
				wallStates: new WallManager(),
			});
			map.restore(patch({}, p.delta!));
			if (map.hasStarted) {
				this.start();
			}
			this.mateStates.set(peer, map);
			return;
		}

		this.mateStates.get(peer)?.apply(p, peer);
	}

	public resolve(input: ResolveInput): void {
		this.planeswalk(input);
	}

	public export(): Exported {
		return {
			...super.dump(),
			deck: { cards: [], played: [] },
		};
	}
}
