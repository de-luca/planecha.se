<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="ghost" class="w-[3.5rem]" title="Roll dices">
        <Dices class="!h-full !w-full" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-[15rem]" side="right">
      <DropdownMenuItem 
        @click="open('planar')"
        @mouseover="hover = true"
        @mouseleave="hover = false"
      >
        <component :is="hover ? Chaos : Planeswalk" class="fill-(--foreground) [&_path]:fill-(--foreground)" />
        <span>Roll the Planar Dice</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="open('coin')">
        <component :is="SVGs.Coin" class="fill-(--foreground) [&_path]:fill-(--foreground)" />
        <span>Flip a coin</span>
      </DropdownMenuItem>
      <DropdownMenuItem v-for="(dice, name) in DICES" @click="open(name)">
        <component :is="dice" class="fill-(--foreground) [&_path]:fill-(--foreground)" />
        <span>Roll a {{ name }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog :open="isOpen" @update:open="isOpen = $event">
    <DialogContent class="w-[15rem] h-[15rem]">
      <div @click="roll" class="flex flex-col items-center justify-center" title="Reroll">
        <component :is="backdrop" class="fill-(--accent) [&_path]:fill-(--accent)"/>
        <div class="absolute text-xl text-foreground">
          <LoaderCircle v-if="rolling" class="animate-spin" />
          <span v-else>{{ outcome }}</span>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dices, LoaderCircle } from "lucide-vue-next";
import { h, markRaw, ref } from "vue";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import * as SVGs from "@/components/svgs/dices";
import { Chaos, Planeswalk } from "@/components/svgs/symbols";
import { useMain } from "@/store/main";

const DICES = {
	d4: markRaw(SVGs.D4),
	d6: markRaw(SVGs.D6),
	d8: markRaw(SVGs.D8),
	d10: markRaw(SVGs.D10),
	d12: markRaw(SVGs.D12),
	d20: markRaw(SVGs.D20),
};

const store = useMain();

const hover = ref(false);

const isOpen = ref(false);
const rolling = ref(false);
const outcome = ref<string | number>();
const rollAction = ref<() => string | number>(() => 0);
const backdrop = ref();

const open = (type: string) => {
	backdrop.value = getBackdrop(type);
	isOpen.value = true;
	rollAction.value = getAction(type);
	roll();
};

const roll = () => {
	rolling.value = true;
	outcome.value = undefined;
	setTimeout(() => {
		rolling.value = false;
		outcome.value = rollAction.value();
	}, 1000);
};

const getAction = (type: string): (() => string | number) => {
	switch (type) {
		case "planar":
			return () => store.rollPlanarDice().toLowerCase().replace("_", " ");
		case "coin":
			return () => store.flipCoin().toLowerCase();
		case "d4":
			return () => store.rollDice(4);
		case "d6":
			return () => store.rollDice(6);
		case "d8":
			return () => store.rollDice(8);
		case "d10":
			return () => store.rollDice(10);
		case "d12":
			return () => store.rollDice(12);
		case "d20":
			return () => store.rollDice(20);
		default:
			throw new Error("What kind of dice is that?");
	}
};

const getBackdrop = (type: string) => {
	switch (type) {
		case "planar":
			return h("div");
		case "coin":
			return SVGs.Coin;
		default:
			return DICES[type];
	}
};
</script>
