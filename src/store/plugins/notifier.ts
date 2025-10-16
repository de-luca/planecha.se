import type { PiniaPluginContext } from "pinia";
import { toast } from "vue-sonner";
import { type ByePayload, type HeyPayload, isMain } from "../main";

const actions = ["hey", "bye"];

export function notifier({ store }: PiniaPluginContext) {
	if (isMain(store)) {
		store.$onAction(({ after, args, name }) => {
			if (!actions.includes(name) || store.mates.size === 0) return;

			let playerName = "";
			let action = "";

			switch (name) {
				case "hey":
					playerName = (args[0] as HeyPayload).name;
					action = "joined";
					break;
				case "bye":
					playerName = store.mates.get((args[0] as ByePayload).id) ?? "";
					action = "left";
					break;
			}

			after(() => toast(`${playerName} has ${action} the game`));
		}, true);
	}
}
