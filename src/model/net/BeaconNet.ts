import {
	type ActionReceiver,
	type ActionReceiverSetter,
	type ActionSender,
	Bridge,
} from "@planecha.se/bridge";

import type { InitPayload, MainStore } from "@/store/main";
import type { Patch } from "@/utils/delta";
import { OfflineError, ServerError } from "./errors";
import {
	type BootParams,
	type CreateParams,
	EventType,
	type GameData,
	type Hey,
	type NetInterface,
	type Props,
} from "./NetInterface";

export class BeaconNet implements NetInterface {
	private store: MainStore;
	private bridge: Bridge<GameData>;

	private ready: boolean;
	private _gameId?: string;
	private _gameData?: GameData;
	private _peerCount = 0;

	private _initReceiver: ActionReceiverSetter<InitPayload>;

	private _hey: ActionSender<Hey>;
	private _sync: ActionSender<Patch>;
	private _undo: ActionSender<number>;
	private _feed: ActionSender<string>;
	private _reset: ActionSender<InitPayload>;
	private _init: ActionSender<InitPayload>;

	private constructor({ store, gameId, gameData }: Props) {
		this.ready = !gameId;
		this._gameId = gameId;
		this._gameData = gameData;

		this.store = store;
		this.bridge = Bridge.withBeacon(import.meta.env.VITE_BEACON_URL!);

		const [initSender, initReceiver] = this.bridge.makeAction<InitPayload>(
			EventType.INIT,
		);
		const [heySender, heyReceiver] = this.bridge.makeAction<Hey>(EventType.HEY);
		const [syncSender, syncReceiver] = this.bridge.makeAction<Patch>(
			EventType.SYNC,
		);
		const [undoSender, undoReceiver] = this.bridge.makeAction<number>(
			EventType.UNDO,
		);
		const [feedSender, feedReceiver] = this.bridge.makeAction<string>(
			EventType.FEED,
		);
		const [resetSender, resetReceiver] = this.bridge.makeAction<InitPayload>(
			EventType.RESET,
		);

		this._initReceiver = initReceiver;

		this._hey = heySender;
		this._sync = syncSender;
		this._undo = undoSender;
		this._feed = feedSender;
		this._reset = resetSender;
		this._init = initSender;

		this.bridge.onPeerLeave((peerId) => this.store.bye({ id: peerId }));
		this.bridge.onPeerJoin((peerId) => {
			if (this.ready) {
				initSender(this.store.initPayload, peerId);
			}
			heySender({ name: this.store.playerName! }, peerId);
		});

		heyReceiver((data, peerId) => {
			if (store.mates.has(peerId)) {
				store.mates.set(peerId, data.name);
			} else {
				store.hey({ ...data, id: peerId });
				heySender({ name: store.playerName! }, peerId);
			}
		});

		syncReceiver((data, peerId) => store.apply(data, peerId));
		undoReceiver((data) => store.applyUndo(data));
		feedReceiver((data) => store.feed.push(data));
		resetReceiver((data) => store.applyReset(data));
	}

	public get gameId() {
		return this._gameId!;
	}

	public get gameData() {
		return this._gameData!;
	}

	public get peerCount() {
		return this._peerCount;
	}

	public get hey() {
		return this._hey;
	}

	public get sync() {
		return this._sync;
	}

	public get undo() {
		return this._undo;
	}

	public get feed() {
		return this._feed;
	}

	public get reset() {
		return this._reset;
	}

	public get init() {
		return this._init;
	}

	public set initHandler(handler: ActionReceiver<InitPayload>) {
		this._initReceiver(handler);
	}

	private async create(gameData: GameData): Promise<void> {
		const data = await this.bridge.create(gameData);
		this._gameId = data.room;
	}

	public static async create({
		store,
		gameData,
	}: CreateParams): Promise<BeaconNet> {
		const net = new BeaconNet({ store, gameData });
		try {
			await net.create(gameData);
		} catch (_) {
			throw net.diagnoseError();
		}
		return net;
	}

	private async loadRoomInfo() {
		const info = await this.bridge.getInfo(this.gameId!);
		this._gameData = info.data;
		this._peerCount = info.peers;
	}

	public static async boot({ store, gameId }: BootParams): Promise<BeaconNet> {
		const net = new BeaconNet({ store, gameId });
		try {
			await net.loadRoomInfo();
		} catch (_) {
			throw net.diagnoseError();
		}
		return net;
	}

	public async join(handler: ActionReceiver<InitPayload>): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const timeout = setTimeout(() => {
				this.bridge.leave();
				reject(this.diagnoseError());
			}, 5000);

			this._initReceiver((data, peer) => {
				clearTimeout(timeout);
				handler(data, peer);
				this.init(this.store.initPayload);
				this.ready = true;
				resolve();
			});
			this.bridge.join(this._gameId!);
		});
	}

	public leave(): void {
		this.bridge.leave();
	}

	private diagnoseError(): Error {
		if (!navigator.onLine) {
			return new OfflineError();
		}

		return new ServerError();
	}
}
