import { computed } from "vue";
import { useMain } from "@/store";
import { shuffle } from "@/utils/shuffle";
import type { PickedLeft } from "../wall/reveal";

export const useGame = () => {
	const store = useMain();

	const hasStarted = computed(() => store.game.hasStarted);
	const putBack = ({ picked, left }: PickedLeft) =>
		store.resolveReveal({
			top: picked,
			bottom: shuffle(left),
		});
	const customPlaneswalk = ({ picked, left }: PickedLeft) => {
		store.planeswalk({ planes: picked });
		putBack({ picked: [], left });
	};

	return {
		hasStarted,
		putBack,
		customPlaneswalk,
	};
};
