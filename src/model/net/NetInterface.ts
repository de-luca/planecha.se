import type { ActionReceiver } from "trystero";
import type { InitPayload, MainStore } from "#/store/main";

import type { GameType } from "#/model/game";
import type { Patch } from "#/utils/delta";

export enum EventType {
	BOOT = "BOOT",
	JOIN = "JOIN",
	INIT = "INIT",
	HEY = "HEY",
	SYNC = "SYNC",
	UNDO = "UNDO",
	FEED = "FEED",
	RESET = "RESET",
}

export type Hey = {
	name: string;
};

export interface GameData {
	gameType: GameType;
}

export type CreateParams = {
	store: MainStore;
	gameData: GameData;
};

export type BootParams = {
	store: MainStore;
	gameId: string;
};

export type Props = { store: MainStore } & (
	| {
			gameId: string;
			gameData?: undefined;
	  }
	| {
			gameId?: undefined;
			gameData: GameData;
	  }
);

export type InitHandler = Parameters<ActionReceiver<InitPayload>>[0];

export interface NetInterface {
	gameId: string;
	gameData: GameData;
	peerCount: number;

	set initHandler(handler: InitHandler);

	join(handler: InitHandler): Promise<void>;

	hey(data: Hey): void;
	sync(patch: Patch): void;
	undo(index: number): void;
	feed(log: string): void;
	reset(payload: InitPayload): void;
	init(payload: InitPayload): void;
	leave(): void;
}
