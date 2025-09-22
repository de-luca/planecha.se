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
            <div class="flex justify-center items-center gap-5 h-full mr-[40vh]">
               <div v-for="c in revealed.relevant" :key="c.id" class="min-w-[15vh] w-[15vh] max-h-[60vh] hover:z-2">
                <label>
                  <input class="hidden" type="radio" :value="c" v-model="selected">
                  <img :src="buildImgSrc(c)" class="max-w-[30vw] animate-down rounded-[3.5%/4.75%] drop-shadow-[1px_1px_1px_#585858]">
                </label>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="other">
            <div v-if="revealed.others.length > 0" class="flex justify-center items-center gap-5 h-full mr-[20vh]">
              <div  v-for="c in revealed.others" :key="c.id" class="min-w-[15vh] w-[15vh] max-h-[60vh] hover:z-2">
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

  <!-- <div class="modal" style="display: flex">
    <div class="modal-background"></div>
    <div class="modal-content">

      <div class="header">
        <p class="muted"><em><b>{{ config.mateName }}</b> encountered</em></p>
        <h1 class="title" v-if="config.title" v-html="config.title"></h1>
        <h2 class="subtitle" v-if="config.subTitle" v-html="config.subTitle"></h2>
      </div>

      <div class="tabs is-centered is-medium"  v-if="revealed.others.length > 0">
        <ul>
          <li :class="{ 'is-active': activeTab === 'relevant' }">
            <a @click="activeTab = 'relevant'">Relevant Cards ({{ revealed.relevant.length }})</a>
          </li>
          <li :class="{ 'is-active': activeTab === 'others' }">
            <a @click="activeTab = 'others'">Others ({{ revealed.others.length }})</a>
          </li>
        </ul>
      </div>

      <div class="revealed">
        <div class="relevant" v-if="activeTab === 'relevant'">
          <div class="card-wrapper" v-for="c in revealed.relevant" :key="c.id">
            <label>
              <input type="radio" :value="c" v-model="selected">
              <img :src="buildImgSrc(c)">
            </label>
          </div>
        </div>

        <div class="others" v-if="activeTab === 'others' && revealed.others.length > 0">
          <div class="card-wrapper" v-for="c in revealed.others" :key="c.id">
            <img :src="buildImgSrc(c)">
          </div>
        </div>

        <div class="others" v-if="activeTab === 'others' && revealed.others.length === 0">
          <em>Such Empty!</em>
        </div>
      </div>

      <div class="confirm">
        <button
          class="button is-secondary is-medium"
          :disabled="selected === null"
          @click="confirm"
        >
          Confirm choice
        </button>
      </div>
    </div>
  </div> -->
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

import type { Card } from "@/model/card";
import { ref } from "vue";
import type { PickedLeft, RevealConfig } from ".";
import StackStatus from "../StackStatus.vue";
import type { WallConfig } from "../types";

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


<!-- <script lang="ts">
import { Component, Prop } from "vue-facing-decorator";
import { Imgable } from "@/components/Imgable";
import type { Card } from "@/model/card";
import type { Revealed } from "@/model/game";
import type { WallConfig } from "../types";
import type { PickedLeft, RevealConfig } from "./types";

@Component({ emits: ["done"] })
export default class Pick extends Imgable {
	@Prop({ required: true })
	public revealed: Revealed;
	@Prop({ required: true })
	public config: RevealConfig & WallConfig;

	public activeTab = "relevant";
	public selected: Card | null = null;

	public confirm(): void {
		const result: PickedLeft = {
			picked: [this.selected as Card],
			left: [],
		};
		for (const c of this.revealed.relevant) {
			if (c.id !== this.selected?.id) {
				result.left.push(c);
			}
		}
		for (const c of this.revealed.others) {
			result.left.push(c);
		}

		this.$emit("done", result);
	}
}
</script> -->

<!-- <style lang="scss" scoped> -->
// $card-width: 30vw;
// @import "../scss/multi-reveal";

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