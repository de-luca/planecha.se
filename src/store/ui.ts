import { defineStore } from "pinia";
import { type VNode, ref } from "vue";

type ConfirmState = {
	open: boolean;
	title?: string;
	description?: VNode;
	cancelLabel?: string;
	actionLabel?: string;
	onAction: () => void;
	onCancel: () => void;
};

export const useUI = defineStore("ui", () => {
	const confirm = ref<ConfirmState>({
		open: false,
		onAction: () => {},
		onCancel: () => {},
	});

	return { confirm };
});
