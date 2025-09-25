<template>
  <AlertDialog :open="true">
    <AlertDialogContent class="bg-unset border-none h-[90%] w-[90%] !max-w-none flex flex-col">
      <AlertDialogHeader class="h-full">
        <AlertDialogTitle>
          <div class="text-muted-foreground text-xs">
            <template v-if="config.tagline">
              {{ config.tagline }}
            </template>
            <template v-else>
              <b>{{ config.mateName }}</b> encountered
            </template>
          </div>
          {{ config.title }}
        </AlertDialogTitle>
        
        <AlertDialogDescription class="mb-10">
          {{ config.subTitle }}
        </AlertDialogDescription>

        <StackStatus />

        <div class="grid grid-cols-3 gap-4 h-full">
          <Card class="bg-transparent">
            <CardHeader>
              <CardTitle>To the top</CardTitle>
            </CardHeader>
            <CardContent class="h-full w-full">
              <draggable :list="toTop" item-key="id" group="scry" class="h-full w-full">
                  <template #item="{ element }">
                    <div class="relative hover:z-2 active:z-2 min-h-[3rem] max-h-[3rem] h-[3rem]">
                      <img :src="buildImgSrc(element)" class="max-h-[30vh] cursor-all-scroll rounded-[3.5%/4.75%] drop-shadow-[1px_1px_1px_#585858]" />
                    </div>
                  </template>
                </draggable>
            </CardContent>
          </Card>

          <Card class="bg-transparent">
            <CardHeader>
              <CardTitle>Revealed cards</CardTitle>
            </CardHeader>
            <CardContent class="h-full w-full">
              <draggable :list="base" item-key="id" group="scry" class="h-full w-full">
                <template #item="{ element }">
                  <div class="relative hover:z-2 active:z-2 min-h-[3rem] max-h-[3rem] h-[3rem]">
                    <img :src="buildImgSrc(element)" class="max-h-[30vh] cursor-all-scroll rounded-[3.5%/4.75%] drop-shadow-[1px_1px_1px_#585858]" />
                  </div>
                </template>
              </draggable>
            </CardContent>
          </Card>

          <Card class="bg-transparent">
            <CardHeader>
              <CardTitle>To the bottom</CardTitle>
            </CardHeader>
            <CardContent class="h-full w-full">
              <draggable :list="toBottom" item-key="id" group="scry" class="h-full w-full">
                <template #item="{ element }">
                  <div class="relative hover:z-2 active:z-2 min-h-[3rem] max-h-[3rem] h-[3rem]">
                    <img :src="buildImgSrc(element)" class="max-h-[30vh] cursor-all-scroll rounded-[3.5%/4.75%] drop-shadow-[1px_1px_1px_#585858]" />
                  </div>
                </template>
              </draggable>
            </CardContent>
          </Card>
        </div>
      </AlertDialogHeader>

      <AlertDialogFooter class="h-fit">
        <AlertDialogAction 
          :disabled="base.length > 0"
          @click="confirm" 
          class="w-[20rem]"
        >
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Card as CardModel } from "@/model/card";
import type { Revealed } from "@/model/game";
import { buildImgSrc } from "@/utils/img";
import StackStatus from "../StackStatus.vue";
import type { WallConfig } from "../types";
import type { RevealConfig } from ".";

const emit = defineEmits(["done"]);
const { revealed, config } = defineProps<{
	revealed: Revealed;
	config: RevealConfig & WallConfig;
}>();

const base = ref<Array<CardModel>>([...revealed.relevant]);
const toTop = ref<Array<CardModel>>([]);
const toBottom = ref<Array<CardModel>>([]);

const confirm = () =>
	emit("done", {
		picked: [...toTop.value],
		left: [...revealed.others, ...toBottom.value],
	});
</script>
