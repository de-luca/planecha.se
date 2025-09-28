import type { PiniaPluginContext } from "pinia";
import { type Card, SpecialPhenomenon } from "@/model/card";
import { isMain } from "../main";

const ACTIONS = [
	"init",
	"startGame",
	"planeswalk",
	"customPlaneswalk",
	"encounter",
	"resolve",
	"reveal",
	"resolveReveal",
	"privateResolveReveal",
	"updateCounters",
	"updateWallState",
];

const UNSTABLE_EVENTS = ["reveal", "updateWallState"];

const isStable = (action: string, active?: Array<Card>) =>
	!(
		UNSTABLE_EVENTS.includes(action) ||
		(action === "planeswalk" && active?.[0] instanceof SpecialPhenomenon)
	);

export function versionizer({ store }: PiniaPluginContext) {
	if (isMain(store)) {
		store.$onAction(({ after, store, name }) => {
			if (ACTIONS.includes(name)) {
				const stable = isStable(name, store._game?.active);
				after(() =>
					store.sync(store.repo.commit(name, stable, store.game.dump())),
				);
			}
		}, true);
	}
}
