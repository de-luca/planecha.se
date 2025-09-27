<template>
  <AlertDialog :open="true">
    <AlertDialogContent class="bg-unset border-none h-[90%] w-[90%] !max-w-none flex flex-col">
      <AlertDialogHeader class="h-full">
        <AlertDialogTitle>
          <div class="text-muted-foreground text-xs">
            <b>{{ config.mateName }}</b> encountered
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
            <div class="flex justify-center items-center gap-5 h-full mr-[20%]">
               <div v-for="c in revealed.relevant" :key="c.id" class="min-w-[15vh] w-[10%] max-h-[60vh] hover:z-2">
                <label>
                  <input class="hidden" type="radio" :value="c" v-model="selected">
                  <img :src="buildImgSrc(c)" class="max-w-[30vw] animate-down rounded-[3.5%/4.75%] drop-shadow-[1px_1px_1px_#585858]">
                </label>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="other">
            <div v-if="revealed.others.length > 0" class="flex justify-center items-center gap-5 h-full mr-[20%]">
              <div  v-for="c in revealed.others" :key="c.id" class="min-w-[15vh] w-[10%] max-h-[60vh] hover:z-2">
                <img :src="buildImgSrc(c)" class="max-w-[30vw] animate-down grayscale rounded-[3.5%/4.75%] drop-shadow-[1px_1px_1px_#585858]">
              </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center text-xl text-muted-foreground">
              Such Empty!
            </div>
          </TabsContent>
        </Tabs>
      </AlertDialogHeader>

      <AlertDialogFooter class="h-fit">
        <AlertDialogAction 
          :disabled="!selected"
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
import type { Card } from "@/model/card";
import type { Revealed } from "@/model/game";
import { buildImgSrc } from "@/utils/img";
import StackStatus from "../StackStatus.vue";
import type { WallConfig } from "../types";
import type { PickedLeft, RevealConfig } from ".";

const emit = defineEmits(["done"]);
const { revealed, config } = defineProps<{
	revealed: Revealed;
	config: RevealConfig & WallConfig;
}>();

const selected = ref<Card>();

const confirm = () => {
	const result: PickedLeft = {
		picked: [selected.value!],
		left: [],
	};
	for (const c of revealed.relevant) {
		if (c.id !== selected.value?.id) {
			result.left.push(c);
		}
	}
	for (const c of revealed.others) {
		result.left.push(c);
	}

	emit("done", result);
};
</script>

<style lang="css" scoped>
input[type="radio"]:checked+img {
  filter:
    drop-shadow(0 0 5px #7DF9FF)
    drop-shadow(0 0 5px #7DF9FF)
    drop-shadow(0 0 5px #7DF9FF)
  ;
}

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