<template>
  <Button @click.prevent="click" :size="size" :variant="variant">
	<slot v-if="idle" name="idle" />
	<slot v-else name="action" />
  </Button>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { Button, type ButtonVariants } from "@/components/ui/button";

const { timeout, variant, size } = defineProps<{
	timeout: number;
	variant: ButtonVariants["variant"];
	size: ButtonVariants["size"];
}>();

const idle = ref(true);

const click = () => {
	idle.value = false;
	setTimeout(() => {
		idle.value = true;
	}, timeout);
};
</script>
