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

  <!-- <div class="modal" style="display: flex">
    <div class="modal-background"></div>
    <div class="modal-content">

      <div class="header">
        <h1 class="title">Order the triggers on the stack</h1>
        <h2 class="subtitle">Effets will resolve <b>top to bottom</b>.</h2>
      </div>

      <div class="stack">
        <draggable :list="ordered" item-key="id" class="box drag">
          <template #item="{ element }">
            <div class="box">{{ element.name }}</div>
          </template>
        </draggable>
      </div>

      <div class="confirm">
        <button class="button is-secondary is-medium" @click="done">
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

import type { Card } from "@/model/card";
import { buildImgSrc } from "@/utils/img";
import StackStatus from "./StackStatus.vue";

const emit = defineEmits(["done"]);
const { cards } = defineProps<{ cards: Array<Card> }>();
const ordered = ref([...cards]);
const done = () => emit("done", ordered.value);
</script>

<!-- <script lang="ts">
import { Component, Prop } from "vue-facing-decorator";
import * as draggable from "vuedraggable";
import { Imgable } from "@/components/Imgable";
import type { Card } from "@/model/card";
import { useMain } from "@/store/main";

@Component({
	emits: ["done"],
	components: { draggable },
})
export default class StackWall extends Imgable {
	@Prop({ required: true })
	public cards: Array<Card> | null;
	public active: Array<Card> = [];

	public created(): void {
		this.active = [...(this.cards ?? useMain().game.active)];
	}

	public done(): void {
		this.$emit("done", this.active);
	}
}
</script> -->

<!-- <style lang="scss" scoped>
@import './scss/header';
@import './scss/modal-content';
@import './scss/confirm';

$card-width: 40vw;

.modal-content {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 2fr 1fr;
  column-gap: 1rem;
  row-gap: 1rem;
  grid-template-areas:
    "header"
    "stack"
    "confirm"
  ;
}

.stack {
  grid-area: stack;

  display: flex;
  flex-direction: column;
  justify-content: center;

  .drag {
    width: 50vw;
    display: flex;
    flex-direction: column;
    gap: .5rem;

    background-color: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-color);

    max-height: 45vh;
    overflow-y: scroll;

    .box {
      margin-bottom: 0;
      cursor: all-scroll;

      background-color: var(--bg-color);
      border: 1px solid var(--border-color);
      color: var(--text-color);
    }
  }
}
</style> -->
