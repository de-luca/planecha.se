<template>
  <Form 
    v-slot="{ handleSubmit }" 
    as="" 
    :initial-values="{ username: store.selfName }" 
    keep-values 
    :validation-schema="formSchema"
  >
    <Dialog :open="isOpen" @update:open="isOpen = $event">
      <DialogTrigger as-child>
        <Button 
          @click.prevent.stop="console.log($event)"
          class="w-50" 
          variant="secondary"
        >
          {{ store.selfName ?? 'Not set' }}
        </Button>
      </DialogTrigger>
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
import { ref } from "vue";
import * as z from "zod";
import NameInput from "@/components/controls/NameInput.vue";
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
import { useMain } from "@/store/main";

const store = useMain();

const isOpen = ref(false);

const formSchema = toTypedSchema(
	z.object({
		username: z.string().min(2).max(50),
	}),
);

// biome-ignore lint/suspicious/noExplicitAny: ignore
const onSubmit = (values: any) => {
	store.setName(values.username);
	isOpen.value = false;
};
</script>