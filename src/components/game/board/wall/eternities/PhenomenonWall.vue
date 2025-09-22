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

  <!-- <div class="modal" style="display: flex">
    <div class="modal-background"></div>
    <div class="modal-content">
      <h1 class="title">{{ config.mateName }} encountered a Phenomenon</h1>
      <img :src="imgSrc">
      <button
        class="button is-ghost planeswalk-btn"
        title="Encounter"
        @click="$emit('resolve')"
      >
        <Planeswalk class="icn is-primary" />
      </button>
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

import type { Phenomenon } from "@/model/card";
import { buildImgSrc } from "@/utils/img";
import type { WallConfig } from "../types";

const emit = defineEmits(["resolve"]);
const { config, phenomenon } = defineProps<{
	config: WallConfig;
	phenomenon: Phenomenon;
}>();
</script>

<!-- <script lang="ts">
import { Component, Prop } from "vue-facing-decorator";
import { Imgable } from "@/components/Imgable";
import type { Phenomenon } from "@/model/card";
import type { WallConfig } from "./types";

import { Planeswalk } from "@/components/svgs/symbols";

@Component({
	emits: ["resolve"],
	components: { Planeswalk },
})
export default class PhenomenonWall extends Imgable {
	@Prop({ required: true })
	public config: WallConfig;
	@Prop({ required: true })
	public phenomenon: Phenomenon;

	public get imgSrc(): string {
		return this.buildImgSrc(this.phenomenon);
	}
}
</script> -->

<!-- <style lang="scss" scoped>
.modal-content {
  position: absolute;
  max-height: 100vh;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  img {
    height: 65%;
    border-radius: 3.5% / 4.7%;
    filter:
      drop-shadow(0 0 5px #DC143C)
      drop-shadow(0 0 5px #DC143C)
      drop-shadow(0 0 5px #DC143C)
    ;
  }

  .planeswalk-btn {
    height: 6rem;
  }
}
</style> -->
