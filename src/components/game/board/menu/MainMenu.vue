<template>
  <DropdownMenu :open="isOpen" @update:open="isOpen = $event">
    <DropdownMenuTrigger title="Configuration">
      <Button variant="ghost" class="w-[3.5rem]">
        <Cog class="!h-full !w-full" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="right">
      <DropdownMenuLabel class="flex gap-10 justify-between items-center">
        Theme: <ThemeSelector />
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuLabel class="flex gap-10 justify-between items-center">
        Player Name:
        <Button 
          @click="openPlayerName(); isOpen = false"
          class="w-50" 
          variant="secondary"
        >
          {{ store.playerName ?? 'Not set' }}
        </Button>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <template v-if="store.isMulti">
        <DropdownMenuItem @click="layoutOpen = true">
          Player Layout
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </template>
      <DropdownMenuItem @click="reset">
        Reset Game
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="close">
        {{ !!store.net ? 'Leave' : 'Close' }} Game
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog 
    v-if="store.isMulti" 
    :open="layoutOpen" 
    @update:open="layoutOpen = $event"
  >
    <DialogContent class="w-[26rem]">
      <DialogHeader>
        <DialogTitle>Customize Player Layout</DialogTitle>
        <DialogDescription>
          Chose the layout type and reorder player seats.
        </DialogDescription>
      </DialogHeader>
      <ToggleGroup type="single" variant="outline" class="w-full" v-model="layout">
        <ToggleGroupItem value="x2" class="h-12 basis-0 grow flex flex-col justify-center items-center">
          <div class="grid grid-cols-2 gap-0">
            <Square />
            <Square />
            <Square />
            <ArrowRight />
          </div>
        </ToggleGroupItem>
        <ToggleGroupItem value="x3" class="h-12 basis-0 grow flex flex-col justify-center items-center">
          <div class="grid grid-cols-3 gap-0">
            <Square />
            <Square />
            <Square />
            <Square />
            <ArrowRight />
          </div>
        </ToggleGroupItem>
      </ToggleGroup>

      <draggable 
        :list="store.playerLayout.players" 
        item-key="index" 
        class="grid gap-1 grid-cols-2" 
        :class="layoutClass"
      >
        <template #item="{ element }">
          <Card>
            <CardHeader>
              <CardTitle>{{ store.getMateName(element) }}</CardTitle>
            </CardHeader>
          </Card>
        </template>
      </draggable>
      
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ArrowRight, Cog, Square } from "lucide-vue-next";
import { computed, h, ref } from "vue";
import { useRouter } from "vue-router";
import * as draggable from "vuedraggable";

import { ThemeSelector } from "@/components/controls";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { useMain, useUI } from "@/store";

const router = useRouter();
const store = useMain();
const { openConfirm, closeConfirm, openPlayerName } = useUI();

const layoutOpen = ref(false);
const isOpen = ref(false);

const layout = computed({
	get: () => store.playerLayout.layout,
	set: (value) => store.setLayout(value),
});

const layoutClass = computed(() => {
	switch (store.playerLayout.layout) {
		case "x2":
			return "grid-cols-2";
		case "x3":
			return "grid-cols-3";
	}
});

const reset = () =>
	openConfirm({
		title: "Do you wish to reset the game?",
		description: h(
			"p",
			"The current game will be discarded and a new shuffled deck will be used.",
		),
		cancelLabel: "Cancel",
		actionLabel: "Reset Game",
		onCancel: closeConfirm,
		onAction: () => {
			store.reset();
			closeConfirm();
		},
	});

const close = () =>
	openConfirm({
		title: `Do you wish to ${store.net ? "leave" : "close"} the game?`,
		description: undefined,
		cancelLabel: "Cancel",
		actionLabel: `${store.net ? "Leave" : "Close"} Game`,
		onCancel: closeConfirm,
		onAction: async () => {
			await router.push("/");
			store.leave();
			closeConfirm();
		},
	});
</script>
