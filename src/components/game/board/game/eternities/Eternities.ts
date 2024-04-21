import { type Phenomenon, Plane } from "#/model/card";
import type {
	EternitiesMap as EternitiesMapModel,
	SingleDeck,
	Tile,
} from "#/model/game/eternities";
import { type PhenomenonWall, RevealerSource, StateKey } from "#/model/wall";
import type { PickedLeft } from "#board/wall/reveal/types";
import { Game } from "../Game";

interface LocalPhenomenonWallConfig {
	config: PhenomenonWall & { mateName?: string };
	phenomenon: Phenomenon;
	seeder: (() => void) | null;
}

export abstract class Eternities extends Game {
	public readonly off: number = 4;
	public displayedTile: Tile | null = null;

	public get phenomenonWallConfig(): LocalPhenomenonWallConfig | undefined {
		if ((this.store.game as SingleDeck).destination) {
			let seeder: (() => void) | null = null;
			switch (this.store.game.walls.get(StateKey.REVEALER)?.source) {
				case RevealerSource.INTERPLANAR_TUNNEL:
					seeder = () => this.store.reveal({ count: 5, type: Plane });
					break;
				case RevealerSource.SPACIAL_MERGING:
					seeder = () => this.store.reveal({ count: 2, type: Plane });
					break;
			}

			const wall = this.store.game.walls.get(StateKey.PHENOMENON_WALL);

			return {
				seeder,
				phenomenon: this.store.game.active[0] as Phenomenon,
				config: {
					...wall!,
					mateName: wall?.initiator,
				},
			};
		}

		return undefined;
	}

	public unreachable(x: number, y: number): boolean {
		return Math.abs(x - this.off) + Math.abs(y - this.off) > 3;
	}

	public getTile(x: number, y: number): Tile | undefined {
		return (this.store.game as EternitiesMapModel).tiles.find((tile) => {
			return tile.coords.x === x - this.off && tile.coords.y === y - this.off;
		});
	}

	public showTileDetails(tile: Tile): void {
		this.displayedTile = tile;
	}

	public hideTileDetails(): void {
		this.displayedTile = null;
	}

	public resolve(): void {
		this.store.resolve();
	}

	public customPlaneswalk(choices: PickedLeft): void {
		super.customPlaneswalk(choices);
		this.store.resolve();
	}
}
