<template>
  <Form 
    v-slot="{ handleSubmit }" 
    as="" 
    :initial-values="{ username: store.username }" 
    keep-values 
    :validation-schema="formSchema"
  >
    <Dialog :open="state.open" @update:open="state.open = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your Username</DialogTitle>
          <DialogDescription>
            Update the username other people see you as.<br>
            Only people joining you on a game will see this name.
          </DialogDescription>
        </DialogHeader>

        <form id="dialogForm" @submit="handleSubmit($event, onSubmit)">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <NameInput v-bind="componentField" />
              </FormControl>
              <FormDescription>
                This username will only be saved on your computer.
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
import { NameInput } from "@/components/controls";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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

const state = useUI().name;
const store = useMain();

const formSchema = toTypedSchema(
	z.object({
		username: z.string().min(2).max(50),
	}),
);

// biome-ignore lint/suspicious/noExplicitAny: ignore
const onSubmit = (values: any) => {
	store.setName(values.username);
	state.onAction();
};
</script>