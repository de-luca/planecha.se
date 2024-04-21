import type { WallManager } from "../wall";

export interface ExportedCard {
	id: string;
	counters?: number;
}

export interface CardInterface {
	id: string;
	name: string;
	typeLine: string;
	oracleText: string;

	chaos(walls: WallManager, initiator: string): void;
	enter(walls: WallManager, initiator: string): void;
	leave(): void;
	export(): ExportedCard;
}
