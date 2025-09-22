<template>
  <AlertDialog :open="true">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          <b>{{ config.mateName }}</b> {{ config.mateName === 'You' ? 'are' : 'is' }} attempting to planeswalk
        </AlertDialogTitle>
        <AlertDialogDescription>
          <component :is="title" />
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <div v-if="triggerConfig.mode === 'manual'" class="flex gap-2">
          <Button variant="destructive" @click="encounter">
            Encounter Phenomenon
          </Button>
          <Button class="button is-secondary is-medium" @click="planeswalk">
            Planeswalk
          </Button>
        </div>
        <div v-else>
          <Button v-if="!rolled" @click="roll">
            <LoaderCircle v-if="rolling" class="w-4 h-4 mr-2 animate-spin" />
            <div v-else>Roll!</div>
          </Button>
          <Button
            v-else-if="rolled <= triggerConfig.ratio!"
            variant="destructive"
            @click="encounter"
          >
            Encounter Phenomenon
          </Button>
          <Button v-else @click="planeswalk">
            Planeswalk
          </Button>
        </div>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  <!-- <div class="modal" style="display: flex">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="header">
        <p class="source">
          <em>
            <b>{{ config.mateName }}</b>
            {{ config.mateName === 'You' ? 'are' : 'is' }}
            attempting to planeswalk
          </em>
        </p>
        <h1 class="title" v-html="title"></h1>
      </div>

      <div class="roll-placeholder">
        <fa class="dice" icon="dice-d20" />
        <div v-if="rolled !== 0" class="roll" :class="{ one: rolled === 1 }">
          {{ rolled }}
        </div>
      </div>

      <div v-if="triggerConfig.mechanic === 'manual'" class="control">
        <button class="button is-danger is-medium" @click="encounter">
          Encounter Phenomenon
        </button>
        <button class="button is-secondary is-medium" @click="planeswalk">
          Planeswalk
        </button>
      </div>
      <div v-else class="control">
        <button
          v-if="!rolled"
          class="button is-secondary is-medium"
          :class="{ 'is-loading': rolling }"
          @click="roll"
        >
          Roll!
        </button>
        <button
          v-else-if="rolled === 1"
          class="button is-danger is-outlined is-medium"
          @click="encounter"
        >
          Encounter Phenomenon
        </button>
        <button
          v-else
          class="button is-secondary is-medium"
          @click="planeswalk"
        >
          Planeswalk
        </button>
      </div>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import { LoaderCircle } from "lucide-vue-next";
import { computed, h, ref } from "vue";

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import type { TriggerConfig } from "@/model/game/eternities";
import type { Coordinates, DiceResult } from "@/types";
import type { WallConfig } from "../types";

const emit = defineEmits(["encounter", "planeswalk"]);
const { config, coords, triggerConfig } = defineProps<{
	config: WallConfig;
	coords: Coordinates;
	triggerConfig: TriggerConfig;
}>();

const rolling = ref(false);
const rolled = ref<DiceResult>();

const title = computed(() => {
	console.log(triggerConfig, triggerConfig.enabled, triggerConfig.mode);

	const t =
		triggerConfig.enabled && triggerConfig.mode === "manual"
			? h("p", "Now's the time to roll your dice!")
			: h("div", [
					h(
						"p",
						`You've set phenomenon probability at ${
							triggerConfig.ratio! * 100
						}%.`,
					),
					h("p", "Let's roll for the encounter!"),
				]);

	return t;
});

const roll = async () => {
	rolling.value = true;
	setTimeout(() => {
		rolled.value = Math.random();
		rolling.value = false;
	}, 500);
};

const encounter = () => emit("encounter", coords);
const planeswalk = () => emit("planeswalk", coords);
</script>

<!-- <script lang="ts">
import { Component, Prop } from "vue-facing-decorator";
import { Imgable } from "@/components/Imgable";
import {
	type TriggerConfig,
	type TriggerConfigEnabled,
} from "@/model/game/eternities";
import { useMain } from "@/store/main";
import type { WallConfig } from "./types";

@Component({ emits: ["planeswalk", "encounter"] })
export default class EncounterWall extends Imgable {
	@Prop({ required: true })
	public config: WallConfig;
	@Prop({ required: true })
	public coords: Coordinates;
	@Prop({ required: true })
	public triggerConfig: TriggerConfig;

	private store = useMain();

	public rolling = false;
	public rolled: DiceResult | null = null;

	public get title(): string {
		return this.triggerConfig.enabled &&
			this.triggerConfig.mechanic === "manual"
			? "Now's the time to roll your dice!"
			: "Let's roll for the encounter!";
	}

	public async roll(): Promise<number> {
		this.rolling = true;
		await new Promise((resolve) => window.setTimeout(resolve, 500));
		this.rolling = false;
		this.rolled = this.store.rollDice(
			(this.triggerConfig as TriggerConfigEnabled).ratio,
		);
		return this.rolled;
	}

	public encounter(): void {
		this.$emit("encounter", this.coords);
	}

	public planeswalk(): void {
		this.$emit("planeswalk", this.coords);
	}
}
</script> -->

<!-- <style lang="scss" scoped>
.modal-content {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8rem;

  .source {
    opacity: .5;
  }

  .header {
    text-align: center;
  }

  .title {
    color: var(--text-color);
  }

  .roll-placeholder {
    height: 25%;
    width: 100%;
    text-align: center;
    position: relative;

    .dice {
      height: 100%;
      width: unset;
      color: var(--brand-color-primary);
    }

    .roll {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-45%) translateX(-50%);
      font-weight: bold;
      font-size: 3em;
      color: var(--secondary);

      &.one {
        filter:
          drop-shadow(0 0 5px #DC143C)
          drop-shadow(0 0 5px #DC143C)
          drop-shadow(0 0 5px #DC143C)
        ;
      }
    }

  }

  .control {
    display: inline-flex;
    gap: 1rem;

    button {
      width: 300px;
    }
  }

  button {
    height: 100%;

    &.is-danger {
      color: var(--btn-danger-color);
      background-color: var(--btn-danger-bg);
      border-color: var(--btn-danger-border);

      &:hover {
        color: var(--btn-danger-color);
        background-color: var(--btn-danger-hover-bg);
      }

      &:active {
        color: var(--btn-danger-color);
        background-color: var(--btn-danger-active-bg);
      }
    }
  }
}
</style> -->
