<template>
  <AlertDialog :open="confirm.open" @update:open="confirm.open = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ confirm.title }}</AlertDialogTitle>
        <AlertDialogDescription>
          <component :is="confirm.description" />
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="confirm.onCancel">{{ confirm.cancelLabel }}</AlertDialogCancel>
        <AlertDialogAction @click="confirm.onAction" >{{ confirm.actionLabel }}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useUI } from "@/store/ui";

const confirm = useUI().confirm;
</script>
