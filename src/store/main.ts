import { defineStore, type Store } from "pinia";

import { SpecialPlane } from "@/model/card";
import {
	type AddActivePlaneInput,
	type BuildProps,
	build as buildGame,
	type ChaosInput,
	type GameDump,
	type GameInterface,
	type Multi,
	type PlaneswalkInput,
	type ResolveRevealInput,
	type RevealUntilInput,
	restore as restoreGame,
	type UpdateCounterInput,
} from "@/model/game";
import { DualDeck, type EncounterInput } from "@/model/game/eternities";
import {
	boot as bootNet,
	create as createNet,
	type NetInterface,
} from "@/model/net";
import { Stack, type StackInterface } from "@/model/stack/Stack";
import {
	build as buildRepo,
	type Clone,
	type MaybeDump,
	type RepoInterface,
	restore as restoreRepo,
} from "@/model/ver";
import type { ApplyInput } from "@/model/wall";
import { eventBus } from "@/services/eventBus";
import type {
	CoinFlipResult,
	DiceResult,
	Layout,
	PlanarDiceResult,
} from "@/types";
import { diff, type Patch } from "@/utils/delta";
import { once } from "@/utils/invoke";

export type HeyPayload = {
	id: string;
	name: string;
};
export type ByePayload = { id: string };
export type JoinPayload = {
	roomId: string;
	name: string;
};
export type InitPayload = {
	mapConfig: BuildProps;
	repo: Clone;
	game: GameDump;
	feed: Array<string>;
};

export type PlayerLayout = {
	layout: Layout;
	players: Array<string>;
};

export type State = {
	_config?: BuildProps;

	_game?: GameInterface;
	_repo?: RepoInterface;
	_stack?: StackInterface;

	net?: NetInterface;

	ready: boolean;

	feed: Array<string>;

	mates: Map<string, string>;
	username?: string;
	playerLayout: PlayerLayout;
};

function getState(): State {
	return {
		_config: undefined,

		_game: undefined,
		_repo: undefined,
		_stack: undefined,

		net: undefined,

		ready: false,

		feed: [],

		mates: new Map(),

		username: localStorage.getItem("username") ?? undefined,
		playerLayout: {
			layout: (localStorage.getItem("layout") as Layout) ?? "x2",
			players: [""],
		},
	};
}

export type MainStore = ReturnType<typeof useMain>;
export type MainStoreState = Omit<
	MainStore,
	keyof ReturnType<typeof defineStore>
>;

export function isMain(store: Store): store is MainStore {
	return store.$id === "main";
}

export const useMain = defineStore("main", {
	state: getState,

	getters: {
		config(): BuildProps {
			if (this._config) return this._config;
			throw new Error("Config is undefined (store is in unset state)");
		},
		game(): GameInterface {
			if (this._game) return this._game;
			throw new Error("Game is undefined (store is in unset state)");
		},
		repo(): RepoInterface {
			if (this._repo) return this._repo;
			throw new Error("Repo is undefined (store is in unset state)");
		},
		stack(): StackInterface {
			if (this._stack) return this._stack;
			throw new Error("Stack is undefined (store is in unset state)");
		},
		logName(): string {
			return this.net ? this.username! : "You";
		},
		gameId(): string | undefined {
			return this.net?.gameId;
		},
		isMulti(): boolean {
			return this._config?.type === "multi";
		},
		initPayload(): InitPayload {
			return {
				mapConfig: this.config,
				repo: this.repo.clone(),
				game: this.game.dump(),
				feed: [...this.feed],
			};
		},
	},

	actions: {
		setName(name: string): void {
			this.username = name;
			localStorage.setItem("username", this.username);
			this.net?.hey({ name: this.username });
		},
		setLayout(layout: Layout): void {
			this.playerLayout.layout = layout;
			localStorage.setItem("layout", layout);
		},

		getMateName(id?: string): string {
			return id ? (this.mates.get(id) ?? "Fblthp") : "You";
		},

		hey(payload: HeyPayload): void {
			this.mates.set(payload.id, payload.name);
			this.playerLayout.players.push(payload.id);
		},
		bye(payload: ByePayload): void {
			this.mates.delete(payload.id);
			if (this.isMulti) {
				(this.game as Multi).removeMate(payload.id);
				this.playerLayout.players.splice(
					this.playerLayout.players.indexOf(payload.id),
					1,
				);
			}
		},

		init(payload: BuildProps) {
			this.leave();
			this._config = payload;
			this._game = buildGame(payload);
			this._repo = buildRepo(payload);
			this._stack = new Stack();
			this.ready = true;
		},

		async open() {
			this.net = await createNet({
				store: this,
				gameData: { gameType: this.config.type },
			});
			if (this.isMulti) {
				this.net.initHandler = (data, peer) =>
					this.apply(
						{ event: "__init__", delta: diff<MaybeDump>({}, data.game) },
						peer,
					);
			}
			// await this.net.connected;
			// await this.net.create();
		},

		async preJoin(roomId: string) {
			this.leave();
			this.net = await bootNet({ store: this, gameId: roomId });
			return this.net.gameData;
		},

		join(payload: BuildProps) {
			if (payload.type !== "multi") {
				return this.net?.join(
					once((data) => {
						this.applyReset(data);
						this.ready = true;
					}),
				);
			}

			this._config = payload;
			this._game = buildGame(payload);
			this._repo = buildRepo(payload);

			return this.net?.join(
				once((data, peer) => {
					this.feed = data.feed;
					this.apply(
						{ event: "__init__", delta: diff<MaybeDump>({}, data.game) },
						peer,
					);
					this.ready = true;
					this.net!.initHandler = (data, peer) =>
						this.apply(
							{ event: "__init__", delta: diff<MaybeDump>({}, data.game) },
							peer,
						);
				}),
			);
		},

		leave(): void {
			this.net?.leave();
			this.$reset();
			eventBus.all.clear();
		},

		pushToFeed(log: string): void {
			this.feed.push(log);
			this.net?.feed(log);
		},

		sync(patch: Patch): void {
			this.net?.sync(patch);
		},
		apply(patch: Patch, peer: string): void {
			this.game.apply(patch, peer);
			this.repo.apply(patch);
		},
		undo(): void {
			const index = this.repo.getStableIndex();

			if (!this.isMulti) {
				this.applyUndo(index);
				this.net?.undo(index);
				return;
			}

			const base = { ...this.game.dump(), deck: { cards: [], played: [] } };
			this.applyUndo(index);
			this.net?.sync({
				event: "__undo__",
				delta: diff(base, {
					...this.game.dump(),
					deck: { cards: [], played: [] },
				}),
			});
		},
		applyUndo(index: number): void {
			this.game.restore(this.repo.checkout(index));
		},
		reset(): void {
			this._game = buildGame(this.config);
			this._repo = buildRepo(this.config);
			this.feed = [];
			this.net?.reset(this.initPayload);

			if (this.isMulti) {
				this.net?.init(this.initPayload);
			}
		},
		applyReset(payload: InitPayload): void {
			this.feed = payload.feed;

			if (this.isMulti) {
				this._game = buildGame(this.config);
				this._repo = buildRepo(this.config);
				this.net?.init(this.initPayload);
				return;
			}

			this._config = payload.mapConfig;
			this._game = restoreGame(payload.game);
			this._repo = restoreRepo(payload);
		},

		startGame(): void {
			this.game.start();
		},

		chaos(payload: Omit<ChaosInput, "initiator">): void {
			this.game.chaos({ ...payload, initiator: this.logName });
			if (!(payload.card instanceof SpecialPlane)) {
				this.resolveStack();
			}
		},

		planeswalk(payload: Omit<PlaneswalkInput, "initiator">): void {
			this.game.planeswalk({ ...payload, initiator: this.logName });
		},
		addActivePlane(payload: Omit<AddActivePlaneInput, "initiator">): void {
			this.game.addActivePlane({ ...payload, initiator: this.logName });
		},

		resolve() {
			this.game.resolve({ initiator: this.logName });
		},
		updateCounters(payload: UpdateCounterInput) {
			this.game.updateCounter(payload);
		},

		privateReveal(payload: RevealUntilInput) {
			this.game.revealUntil(payload);
		},
		privateResolveReveal(payload: ResolveRevealInput) {
			this.game.resolveReveal(payload);
		},

		reveal(payload: RevealUntilInput) {
			this.game.revealUntil(payload);
		},
		resolveReveal(payload: ResolveRevealInput) {
			this.game.resolveReveal(payload);
		},

		updateWallState(payload: ApplyInput) {
			this.game.walls.apply(payload);
		},

		encounter(payload: Omit<EncounterInput, "initiator">) {
			if (this.game instanceof DualDeck) {
				this.game.encounter({ ...payload, initiator: this.logName });
			}
		},

		resolveStack() {
			console.log("RESOLVE OP STACK");
			const op = this.stack.pop();
			console.log(op);
			if (op) {
				// @ts-expect-error
				this.chaos(op);
			}
		},

		rollDice(sides: number): DiceResult {
			return Math.floor(Math.random() * sides) + 1;
		},
		rollPlanarDice(): PlanarDiceResult {
			const rolled = Math.floor(Math.random() * 6) + 1;
			return rolled === 1 ? "CHAOS" : rolled === 6 ? "PLANESWALK" : "NO_EFFECT";
		},
		flipCoin(): CoinFlipResult {
			return Math.round(Math.random()) ? "HEADS" : "TAILS";
		},
	},
});
