<template>
  <ToggleGroup v-model="theme" type="single" variant="outline">
    <ToggleGroupItem value="auto" aria-label="Toggle auto">
      <LaptopMinimal class="h-4 w-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="dark" aria-label="Toggle dark">
      <Moon class="h-4 w-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="light" aria-label="Toggle light">
      <Sun class="h-4 w-4" />
    </ToggleGroupItem>
  </ToggleGroup>
</template>

<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { LaptopMinimal, Moon, Sun } from "lucide-vue-next";
import { computed } from "vue";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const mode = useColorMode();
const theme = computed({
	get: () => mode.store.value,
	set: (val: "light" | "dark" | "auto") => {
		mode.value = val;
	},
});
</script>
