import { computed, ref } from "vue";

import { type Phenomenon, Plane } from "@/model/card";
import type {
	EternitiesMap as EternitiesMapModel,
	SingleDeck,
	Tile,
} from "@/model/game/eternities";
import { type PhenomenonWall, RevealerSource, StateKey } from "@/model/wall";
import { useMain } from "@/store";
import type { PickedLeft } from "../../wall";
import { useGame } from "../game";

interface LocalPhenomenonWallConfig {
	config: PhenomenonWall & { mateName?: string };
	phenomenon: Phenomenon;
	seeder: (() => void) | null;
}

export const useEternities = () => {
	const store = useMain();
	const {
		hasStarted,
		customPlaneswalk: superCustomPlaneswalk,
		putBack,
	} = useGame();

	const OFF = 4;

	const displayedTile = ref<Tile>();

	const phenomenonWallConfig = computed(
		(): LocalPhenomenonWallConfig | undefined => {
			if ((store.game as SingleDeck).destination) {
				let seeder: (() => void) | null = null;
				switch (store.game.walls.get(StateKey.REVEALER)?.source) {
					case RevealerSource.INTERPLANAR_TUNNEL:
						seeder = () => store.reveal({ count: 5, type: Plane });
						break;
					case RevealerSource.SPACIAL_MERGING:
						seeder = () => store.reveal({ count: 2, type: Plane });
						break;
				}

				const wall = store.game.walls.get(StateKey.PHENOMENON_WALL);

				return {
					seeder,
					phenomenon: store.game.active[0] as Phenomenon,
					config: {
						...wall!,
						mateName: wall?.initiator,
					},
				};
			}

			return undefined;
		},
	);

	const unreachable = (x: number, y: number) =>
		Math.abs(x - OFF) + Math.abs(y - OFF) > 3;
	const getTile = (x: number, y: number) =>
		(store.game as EternitiesMapModel).tiles.find(
			(tile) => tile.coords.x === x - OFF && tile.coords.y === y - OFF,
		);
	const showTileDetails = (tile: Tile) => {
		displayedTile.value = tile;
	};
	const hideTileDetails = () => {
		displayedTile.value = undefined;
	};
	const customPlaneswalk = (choices: PickedLeft) => {
		superCustomPlaneswalk(choices);
		store.resolve();
	};

	return {
		OFF,
		hasStarted,
		putBack,
		displayedTile,
		phenomenonWallConfig,
		unreachable,
		getTile,
		showTileDetails,
		hideTileDetails,
		customPlaneswalk,
	};
};
