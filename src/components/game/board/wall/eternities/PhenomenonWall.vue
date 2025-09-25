<template>
  <AlertDialog :open="true">
    <AlertDialogContent class="bg-unset border-none h-[90%] w-[90%] !max-w-none flex flex-col">
      <AlertDialogHeader class="h-full">
        <AlertDialogTitle>
          {{ config.mateName }} encountered a Phenomenon
        </AlertDialogTitle>
        <AlertDialogDescription class="mb-10">
          Resolve the Phenomenon then click "Planewalk Away" when ready to proceed.
        </AlertDialogDescription>

        <div class="flex justify-center items-center h-full w-full">
          <img :src="buildImgSrc(phenomenon)" class="max-w-[40vw] rounded-[3.5%/4.75%] drop-shadow-[1px_1px_1px_#585858]">
        </div>
      </AlertDialogHeader>

      <AlertDialogFooter class="h-fit">
        <AlertDialogAction @click="emit('resolve')" class="w-[20rem]">
          Planewalk Away
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { Phenomenon } from "@/model/card";
import { buildImgSrc } from "@/utils/img";
import type { WallConfig } from "../types";

const emit = defineEmits(["resolve"]);
const { config, phenomenon } = defineProps<{
	config: WallConfig;
	phenomenon: Phenomenon;
}>();
</script>
