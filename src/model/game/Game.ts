import { getCardList, restoreDeck } from "#/services/cardProvider";
import { type Patch, patch } from "#/utils/delta";
import type { Card, Plane } from "../card";
import type { Deck } from "../deck/Deck";
import { StateKey, WallManager } from "../wall";
import type {
	AddActivePlaneInput,
	ChaosInput,
	Exported,
	GameInterface,
	GameSpecs,
	PlaneswalkInput,
	ResolveInput,
	ResolveRevealInput,
	RevealUntilInput,
	Revealed,
	UpdateCounterInput,
} from "./GameInterface";

export interface GameProps {
	wallStates: WallManager;
	hasStarted?: boolean;
	deck: Deck<Card>;
	active?: Array<Card>;
	revealed?: Revealed;
}

export abstract class Game implements GameInterface {
	protected _deck: Deck<Card>;
	protected _hasStarted: boolean;
	protected _wallStates: WallManager;
	protected _revealed?: Revealed;
	protected _active: Array<Card>;

	public constructor(props: GameProps) {
		this._deck = props.deck;
		this._wallStates = props.wallStates;
		this._hasStarted = props.hasStarted ?? false;
		this._revealed = props.revealed;
		this._active = props.active ?? [];
	}

	public abstract get specs(): GameSpecs;

	public get ready(): Promise<void> {
		return new Promise((resolve) => resolve());
	}

	public get hasStarted(): boolean {
		return this._hasStarted;
	}

	public get walls(): WallManager {
		return this._wallStates;
	}

	public get revealed(): Revealed | undefined {
		return this._revealed;
	}

	public get active(): Array<Card> {
		return this._active;
	}

	public get remaining(): number {
		return this._deck.remaining;
	}

	public get played(): Array<Card> {
		return this._deck.played;
	}

	public start(): void {
		this._hasStarted = true;
	}

	public chaos(input: ChaosInput): void {
		input.card.chaos(this._wallStates, input.initiator);
	}

	public abstract planeswalk(input: PlaneswalkInput): void;

	public abstract addActivePlane(input: AddActivePlaneInput): void;

	public abstract resolve(input: ResolveInput): void;

	public updateCounter(input: UpdateCounterInput): void {
		(this._active.find((c) => c.id === input.planeId) as Plane).updateCounter(
			input.change,
		);
	}

	public revealUntil(input: RevealUntilInput): void {
		const { relevant, others } = this._deck.revealUntil(
			input.count,
			input.type,
		);
		this._revealed = { relevant, others };
	}

	public resolveReveal(input: ResolveRevealInput): void {
		this._deck.putOnTop(input.top);
		this._deck.putOnTheBottom(input.bottom);
		this.clearRevealed();
		this._wallStates.delete(StateKey.REVEALER);
	}

	private clearRevealed(): void {
		this._revealed = undefined;
	}

	public dump(): Exported {
		return {
			specs: this.specs,
			hasStarted: this._hasStarted,
			wallStates: this._wallStates.export(),
			deck: this._deck.export(),
			active: this._active.map((c) => c.export()),
			revealed:
				this._revealed === undefined
					? undefined
					: {
							relevant: this._revealed.relevant.map((c) => c.id),
							others: this._revealed.others.map((c) => c.id),
						},
		};
	}

	public export(): Exported {
		return this.dump();
	}

	public apply(patch: Patch, _peer: string): void {
		const state = this.crunchState(patch);
		if (state) {
			this.restore(state);
		}
	}

	protected crunchState(p: Patch): Exported | undefined {
		return p.delta ? patch(this.export(), p.delta) : undefined;
	}

	public restore(state: Exported): void {
		this._hasStarted = state.hasStarted;
		this._wallStates = new WallManager(state.wallStates);
		this._deck = restoreDeck(state.deck);
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
