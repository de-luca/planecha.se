<template>
	<div class="flex w-full items-center gap-1.5">
		<InputGroup>
			<InputGroupInput type="text" v-model="name" placeholder="Fblthp" />
			<InputGroupAddon align="inline-end">
				<InputGroupButton 
					size="icon-xs"
					title="Randomize name"
					@click.prevent="randomize"
				>
					<Shuffle />
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	</div>
</template>

<script setup lang="ts">
import { Shuffle } from "lucide-vue-next";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { generateName } from "@/utils/generator";

const name = defineModel<string>();
const randomize = () => {
	name.value = generateName();
};
</script>