<template>
	<Dialog :open="deckName.open" @update:open="closeDeckName">
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{{ deckName.title }}</DialogTitle>
				<DialogDescription>{{ deckName.description }}</DialogDescription>
			</DialogHeader>
			
			<form 
				class="flex flex-col gap-5"
				id="saveDeckForm" 
				@submit="onSubmit"
			>
				<FormField v-slot="{ componentField }" name="name">
					<FormItem>
						<FormLabel>Name</FormLabel>
						<FormControl>
							<Input type="text" placeholder="Super Duper Planar Deck" v-bind="componentField" />
						</FormControl>
						<FormDescription>
							Give a name to your planar deck.
						</FormDescription>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="desc">
					<FormItem>
						<FormLabel>Description</FormLabel>
						<FormControl>
							<Textarea placeholder="The best bunch of cards." v-bind="componentField" />
						</FormControl>
						<FormDescription>
							Give a description to your planar deck. (Optional)
						</FormDescription>
						<FormMessage />
					</FormItem>
				</FormField>
			</form>

			<DialogFooter>
				<Button type="submit" form="saveDeckForm">
					{{ deckName.actionLabel }}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { watch } from "vue";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUI } from "@/store";

const { deckName, closeDeckName } = useUI();

const formSchema = toTypedSchema(
	z.object({
		name: z.string().min(1).max(50),
		desc: z.string().optional(),
	}),
);

const { handleSubmit, resetForm } = useForm({
	validationSchema: formSchema,
});

const onSubmit = handleSubmit((values) => deckName.onAction(values));

watch([deckName], () =>
	resetForm({
		values: {
			name: deckName.deckName,
			desc: deckName.deckDesc,
		},
	}),
);
</script>



