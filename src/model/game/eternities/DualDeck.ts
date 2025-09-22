import type { Phenomenon } from "@/model/card";
import type { Deck, DeckDump } from "@/model/deck/Deck";
import { StateKey } from "@/model/wall";
import { restoreDeck } from "@/services/cardProvider";
import type { Coordinates } from "@/types";
import type { Initable, ResolveInput } from "../GameInterface";
import type { EternitiesMapDump, EternitiesMapSpecs } from "./EternitiesMap";
import { SingleDeck, type SingleDeckProps } from "./SingleDeck";

export type EncounterTrigger = "onPlaneswalk" | "onHellride";
export type EncounterMode = "manual" | "auto";

export type TriggerConfigDisabled = {
	enabled: boolean;
	mode?: EncounterMode;
	ratio?: number;
};
export type TriggerConfigEnabled = Required<TriggerConfigDisabled> & {
	enabled: true;
};
export type TriggerConfig = TriggerConfigEnabled | TriggerConfigDisabled;
export type EncounterTriggers = Record<EncounterTrigger, TriggerConfig>;

export type DualDeckDump = EternitiesMapDump & {
	phenomenaDeck: DeckDump;
	encounterTriggers: EncounterTriggers;
};

export type DualDeckProps = SingleDeckProps & {
	deckType: "planes";
	phenomenaDeck: Deck<Phenomenon>;
	encounterTriggers: EncounterTriggers;
};

export type EncounterInput = Initable & { coords: Coordinates };

export class DualDeck extends SingleDeck {
	private _phenomenaDeck: Deck<Phenomenon>;
	private _encounterTriggers: EncounterTriggers;

	public constructor(props: DualDeckProps) {
		super(props);
		this._phenomenaDeck = props.phenomenaDeck;
		this._encounterTriggers = props.encounterTriggers;
	}

	public get specs(): EternitiesMapSpecs {
		return {
			type: "eternities",
			subType: "dual",
			deckType: this._deckType,
		};
	}

	public get encounterTriggers(): EncounterTriggers {
		return this._encounterTriggers;
	}

	public get remainingPhenomena(): number {
		return this._phenomenaDeck.remaining;
	}

	public get playedPhenomena(): Array<Phenomenon> {
		return this._phenomenaDeck.played;
	}

	public encounter(input: EncounterInput): void {
		this._destination = input.coords;
		this._active = [this._phenomenaDeck.draw()];
		for (const c of this._active) {
			c.enter(this._wallStates, input.initiator);
		}
		this._wallStates.set(StateKey.PHENOMENON_WALL, {
			initiator: input.initiator,
		});
	}

	public override resolve(input: ResolveInput): void {
		this._phenomenaDeck.setPlayed(...(this._active as Array<Phenomenon>));
		this._wallStates.delete(StateKey.PHENOMENON_WALL);
		this.planeswalk({
			...input,
			coords: this._destination as Coordinates,
		});
	}

	public override dump(): DualDeckDump {
		return {
			...super.dump(),
			phenomenaDeck: this._phenomenaDeck.dump(),
			encounterTriggers: this._encounterTriggers,
		};
	}

	public override restore(dump: DualDeckDump): void {
		super.restore(dump);
		this._phenomenaDeck = restoreDeck(dump.phenomenaDeck);
	}
}
