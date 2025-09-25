<template>
  <AlertDialog :open="true">
    <AlertDialogContent class="bg-unset border-none h-[90%] w-[90%] !max-w-none flex flex-col">
      <AlertDialogHeader class="h-full">
        <AlertDialogTitle>
          Order the triggers on the stack
        </AlertDialogTitle>
        <AlertDialogDescription class="mb-10">
          Effets will resolve <b>top to bottom</b>.
        </AlertDialogDescription>

        <StackStatus />

        <draggable :list="ordered" item-key="id" class="flex flex-col items-center justify-center">
            <template #item="{ element }">
              <div class="relative hover:z-2 active:z-2 min-h-[4rem] max-h-[4rem] h-[4rem]">
                <img :src="buildImgSrc(element)" class="max-w-[500px] max-h-[40vh] cursor-all-scroll rounded-[3.5%/4.75%] drop-shadow-[1px_1px_1px_#585858]" />
              </div>
            </template>
        </draggable>
      </AlertDialogHeader>

      <AlertDialogFooter class="h-fit">
        <AlertDialogAction @click="done" class="w-[10rem]">
          Confirm choice
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as draggable from "vuedraggable";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { Card } from "@/model/card";
import { buildImgSrc } from "@/utils/img";
import StackStatus from "./StackStatus.vue";

const emit = defineEmits(["done"]);
const { cards } = defineProps<{ cards: Array<Card> }>();
const ordered = ref([...cards]);
const done = () => emit("done", ordered.value);
</script>
