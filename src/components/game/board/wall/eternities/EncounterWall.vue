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
