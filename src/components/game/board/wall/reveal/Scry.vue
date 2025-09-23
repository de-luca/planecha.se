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

 <!-- display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      width: 100%;
      margin: 0; -->

        <StackStatus />

        <div class="grid grid-cols-3 gap-4 h-full">
          <!-- <div class="flex flex-col items-center gap-4">
            <div class="text-xl text-muted-foreground">To the top</div>
            
          </div> -->

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

          <!-- <div class="flex flex-col items-center gap-4">
            <div class="text-xl text-muted-foreground">Revealed cards</div>
            <draggable :list="base" item-key="id" group="scry" class="h-full w-full p-1">
              <template #item="{ element }">
                <div class="card-wrapper">
                  <img :src="buildImgSrc(element)" />
                </div>
              </template>
            </draggable>
          </div> -->

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

          <!-- .card-wrapper {
            position: unset;
            min-height: 3rem;
            max-height: 3rem;
            height: 3rem;

            &:hover, &:active {
              z-index: 2;
            }

            img {
              width: auto;
              max-height: 30vh;
              border-radius: var(--card-radius);
              filter: drop-shadow(1px 1px 1px #585858);
              cursor: all-scroll;
            }
          } -->

          <!-- <div class="flex flex-col items-center gap-4">
            <div class="text-xl text-muted-foreground">To the bottom</div>
            <draggable :list="toBottom" item-key="id" group="scry" class="h-full w-full border-1 p-1">
              <template #item="{ element }">
                <div class="card-wrapper">
                  <img :src="buildImgSrc(element)" />
                </div>
              </template>
            </draggable>
          </div> -->
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


  <!-- <div class="modal" style="display: flex">
    <div class="modal-background"></div>
    <div class="modal-content">

      <div class="header">
        <p class="muted" v-if="config.mateName"><em><b>{{ config.mateName }}</b> encountered</em></p>
        <h1 class="title" v-if="config.title" v-html="config.title"></h1>
        <h2 class="subtitle" v-if="config.subTitle" v-html="config.subTitle"></h2>
      </div>

      <div class="revealed">
        <div class="side">
          <div class="subtitle">To the top</div>
          <draggable :list="toTop" item-key="id" group="scry" class="box drag">
            <template #item="{ element }">
              <div class="card-wrapper">
                <img :src="buildImgSrc(element)" />
              </div>
            </template>
          </draggable>
        </div>

        <div class="side">
          <div class="subtitle">Revealed cards</div>
          <draggable :list="base" item-key="id" group="scry" class="drag">
            <template #item="{ element }">
              <div class="card-wrapper">
                <img :src="buildImgSrc(element)" />
              </div>
            </template>
          </draggable>
        </div>

        <div class="side">
          <div class="subtitle">To the bottom</div>
          <draggable :list="toBottom" item-key="id" group="scry" class="box drag">
            <template #item="{ element }">
              <div class="card-wrapper">
                <img :src="buildImgSrc(element)" />
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div class="confirm">
        <button
          class="button is-secondary is-medium"
          @click="confirm"
          :disabled="base.length > 0"
        >
          Confirm choice
        </button>
      </div>

    </div>
  </div> -->
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

<!-- <script lang="ts">
import * as draggable from "vuedraggable";

import { Component, Prop } from "vue-facing-decorator";
import { Imgable } from "@/components/Imgable";
import type { Card } from "@/model/card";
import type { Revealed } from "@/model/game";
import type { WallConfig } from "../types";
import type { RevealConfig } from "./types";

@Component({
	emits: ["done"],
	components: { draggable },
})
export default class Test extends Imgable {
	@Prop({ required: true })
	public revealed: Revealed;
	@Prop({ required: true })
	public config: RevealConfig & WallConfig;

	public picked: Record<string, boolean> = {};
	public id = Math.random().toString(36).substring(2, 15);

	public base: Array<Card> = [];
	public toTop: Array<Card> = [];
	public toBottom: Array<Card> = [];

	public created() {
		this.base = [...this.revealed.relevant];
	}

	public confirm(): void {
		this.$emit("done", {
			picked: [...this.toTop],
			left: [...this.revealed.others, ...this.toBottom],
		});
	}
}
</script> -->

<!-- <style lang="scss" scoped>
@import '../scss/header';
@import '../scss/modal-content';
@import '../scss/confirm';

.modal-content {
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 50vh 1fr;
  column-gap: 1rem;
  row-gap: 1rem;
  grid-template-areas:
    "header"
    "revealed"
    "confirm"
  ;

  .revealed {
    height: 100%;
    grid-area: revealed;
    display: flex;
    flex-direction: row;

    .side {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      width: 100%;
      margin: 0;

      .drag {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: .5rem;
        text-align: center;
        background-color: transparent;
        overflow-y: scroll;

        &.box {
          border: 1px solid var(--border-color);
          color: var(--text-color);
        }
      }
    }
  }

  .card-wrapper {
    position: unset;
    min-height: 3rem;
    max-height: 3rem;
    height: 3rem;

    &:hover, &:active {
      z-index: 2;
    }

    img {
      width: auto;
      max-height: 30vh;
      border-radius: var(--card-radius);
      filter: drop-shadow(1px 1px 1px #585858);
      cursor: all-scroll;
    }
  }
}
</style> -->
