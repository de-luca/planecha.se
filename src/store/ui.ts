import { defineStore } from "pinia";
import { ref, type VNode } from "vue";

type ConfirmState = {
	open: boolean;
	title?: string;
	description?: VNode;
	cancelLabel?: string;
	actionLabel?: string;
	onAction: () => void;
	onCancel: () => void;
};

type NameState = {
	open: boolean;
	onAction: () => void;
	onCancel: () => void;
};

export const useUI = defineStore("ui", () => {
	const confirm = ref<ConfirmState>({
		open: false,
		onAction: () => {},
		onCancel: () => {},
	});

	const name = ref<NameState>({
		open: false,
		onAction: () => {},
		onCancel: () => {},
	});

	return { confirm, name };
});
