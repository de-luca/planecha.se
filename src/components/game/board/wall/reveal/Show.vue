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

        <Tabs default-value="relevant" class="h-full">
          <TabsList class="bg-unset w-full">
            <TabsTrigger value="relevant">
              Relevant cards
            </TabsTrigger>
            <TabsTrigger value="other">
              Others
            </TabsTrigger>
          </TabsList>
          <TabsContent value="relevant">
            <div class="flex justify-center items-center gap-5 h-full mr-[20vw]">
              <div v-for="c in revealed.relevant" :key="c.id" class="min-w-[20vw] w-[20vw] max-h-[60vh] hover:z-2">
                <img :src="buildImgSrc(c)" class="max-w-[40vw] animate-down rounded-[3.5%/4.75%] drop-shadow-[1px_1px_1px_#585858]">
              </div>
            </div>
          </TabsContent>
          <TabsContent value="other">
            <div v-if="revealed.others.length > 0" class="flex justify-center items-center gap-5 h-full mr-[20vw]">
              <div  v-for="c in revealed.others" :key="c.id" class="min-w-[20vw] w-[20vw] max-h-[60vh] hover:z-2">
                <img :src="buildImgSrc(c)" class="max-w-[40vw] animate-down grayscale rounded-[3.5%/4.75%] drop-shadow-[1px_1px_1px_#585858]">
              </div>
            </div>
            <div v-else class="h-full flex flex-col items-center justify-center text-xl text-muted-foreground">
              Such Empty!
            </div>
          </TabsContent>
        </Tabs>
      </AlertDialogHeader>

      <AlertDialogFooter class="h-fit">
        <AlertDialogAction @click="confirm" class="w-[20rem]">Okay</AlertDialogAction>
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Revealed } from "@/model/game";
import { buildImgSrc } from "@/utils/img";

import type { RevealConfig } from ".";
import type { WallConfig } from "../types";

import { useMain } from "@/store/main";
import StackStatus from "../StackStatus.vue";

const store = useMain();

const emit = defineEmits(["done"]);
const { revealed, config } = defineProps<{
	revealed: Revealed;
	config: RevealConfig & WallConfig;
}>();

const confirm = () =>
	emit("done", {
		picked: config.sendShownTo === "top" ? revealed.relevant : [],
		left: revealed.others.concat(
			config.sendShownTo === "top" ? [] : revealed.relevant,
		),
	});
</script>

<style lang="css" scoped>
@keyframes up {
  0% { transform: translateY(0) }
  100% { transform: translateY(-2rem) }
}

@keyframes down {
  0% { transform: translateY(-2rem) }
  100% { transform: translateY(0) }
}

.animate-down {
  animation: down 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
.animate-down:hover {
  animation: up 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
</style>

