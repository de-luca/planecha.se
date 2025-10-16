<template>
	<div class="flex w-full items-center gap-1.5">
		<Input type="text" v-model="name" placeholder="Fblthp" />
		<Button variant="outline" size="icon" @click.prevent="randomize" title="Randomize name">
			<Shuffle class="w-4 h-4" />
		</Button>
	</div>
</template>

<script setup lang="ts">
import { Shuffle } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateName } from "@/utils/generator";

const name = defineModel<string>();
const randomize = () => {
	name.value = generateName();
};
</script>