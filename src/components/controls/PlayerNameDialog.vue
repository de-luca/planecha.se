<template>
  <Form 
    v-slot="{ handleSubmit }" 
    as="" 
    :initial-values="{ playerName: store.playerName }" 
    keep-values 
    :validation-schema="formSchema"
  >
    <Dialog :open="playerName.open" @update:open="playerName.open = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your Player Name</DialogTitle>
          <DialogDescription>
            Update the name other people see you as.<br>
            Only people joining you on a game will see this name.
          </DialogDescription>
        </DialogHeader>

        <form id="dialogForm" @submit="handleSubmit($event, onSubmit)">
          <FormField v-slot="{ componentField }" name="playerName">
            <FormItem>
              <FormLabel>Player Name</FormLabel>
              <FormControl>
                <PlayerNameInput v-bind="componentField" />
              </FormControl>
              <FormDescription>
                This name will only be saved on your computer.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>

        <DialogFooter>
          <Button type="submit" form="dialogForm">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { PlayerNameInput } from "@/components/controls";
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
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useUI } from "@/store";
import { useMain } from "@/store/main";

const { playerName, closePlayerName } = useUI();
const store = useMain();

const formSchema = toTypedSchema(
	z.object({
		playerName: z.string().min(2).max(50),
	}),
);

// biome-ignore lint/suspicious/noExplicitAny: ignore
const onSubmit = (values: any) => {
	store.setName(values.playerName);
	playerName.onAction();
	closePlayerName();
};
</script>