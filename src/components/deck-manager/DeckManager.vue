<template>
  <Dialog :open="isOpen" @update:open="isOpen = $event">
    <DialogTrigger as-child>
      <Card class="hover:bg-accent hover:text-accent-foreground hover:cursor-pointer" title="Open Deck Manager">
        <CardHeader v-if="usedDeck" class="flex justify-between">
          <component :is="usedDeck.component" />
          <CardCount class="text-muted-foreground text-sm" :phenomena="phenomena" :counts="usedDeck.list.counts" />
        </CardHeader>
        <CardHeader v-else class="text-center text-muted-foreground">
          Pick a 10 cards deck
        </CardHeader>
      </Card>
    </DialogTrigger>

    <DialogContent class="sm:max-w-none w-[95vw] h-[95vh]">
      <DialogHeader v-if="tab === 'customs'">
        <DialogTitle>Your Decks</DialogTitle>
        <DialogDescription>
          Use and manage your planar decks.
        </DialogDescription>
      </DialogHeader>
      <DialogHeader v-else-if="tab === 'lists'">
        <DialogTitle>Automatic Lists</DialogTitle>
        <DialogDescription>
          Use a currated list of cards with a common theme.
        </DialogDescription>
      </DialogHeader>
      <DialogHeader v-else-if="tab === 'precons'">
        <DialogTitle>Preconstructed Decks</DialogTitle>
        <DialogDescription>
          Use a planar deck from an MTG product.
        </DialogDescription>
      </DialogHeader>
      <DialogHeader v-else="">
        <DialogTitle>Deck Builder</DialogTitle>
        <DialogDescription>
          Create your own planar decks.
        </DialogDescription>
      </DialogHeader>
      <Tabs default-value="single" class="w-full" v-model="tab">
        <TabsList class="grid w-full grid-cols-4 h-10 px-2.5 min-w-10">
          <TabsTrigger class="dark:data-[state=active]:bg-unset" value="customs">
            Your Decks
          </TabsTrigger>
          <TabsTrigger class="dark:data-[state=active]:bg-unset" value="lists">
            Quick Lists
          </TabsTrigger>
          <TabsTrigger class="dark:data-[state=active]:bg-unset" value="precons">
            Preconstructed Decks
          </TabsTrigger>
          <TabsTrigger class="dark:data-[state=active]:bg-unset" value="builder">
            New Deck
          </TabsTrigger>
        </TabsList>
        <TabsContent value="customs">
          <KeepAlive>
            <CustomList
              v-model="tab"
              :min-cards="minCards" 
              :max-cards="maxCards" 
              :min-planes="minPlanes" 
              :phenomena="phenomena" 
              @use="useDeckList"
            />
          </KeepAlive>
        </TabsContent>
        <TabsContent value="lists">
          <KeepAlive>
            <ListList 
              :min-cards="minCards" 
              :max-cards="maxCards" 
              :min-planes="minPlanes" 
              :phenomena="phenomena" 
              @use="useDeckList"
            />
          </KeepAlive>
        </TabsContent>
        <TabsContent value="precons">
          <KeepAlive>
            <PreconList 
              :min-cards="minCards" 
              :max-cards="maxCards" 
              :min-planes="minPlanes" 
              :phenomena="phenomena" 
              @use="useDeckList"
            />
          </KeepAlive>
        </TabsContent>
        <TabsContent value="builder">
          <KeepAlive>
            <DeckBuilder 
              :min-cards="minCards" 
              :max-cards="maxCards" 
              :min-planes="minPlanes" 
              :phenomena="phenomena" 
              @use="useDeckList"
            />
          </KeepAlive>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, KeepAlive, ref } from "vue";

import { Card, CardHeader } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phenomenon } from "@/model/card";
import type { BaseList } from "@/types/index";
import { CardCount } from "./controls";
import {
	CustomList,
	DEFAULT_LIST,
	DeckBuilder,
	ListList,
	PreconList,
} from "./tabs";
import type { DeckList, Props } from "./utils";

const DEFAULT_TAB = "custom";

const { minCards, maxCards, minPlanes, phenomena } = defineProps<Props>();
const emit = defineEmits(["use"]);

const isOpen = ref(false);
const tab = ref(DEFAULT_TAB);
const deck = ref<DeckList>();

const cleanList = (list?: BaseList): BaseList | undefined =>
	!list
		? list
		: phenomena
			? list
			: {
					...list,
					cards: list.cards.filter((c) => !(c instanceof Phenomenon)),
				};

const usedDeck = computed(() => {
	const value =
		deck.value ?? (minCards === 10 && maxCards === 10 ? null : DEFAULT_LIST);
	emit("use", cleanList(value?.list));
	return value;
});

const useDeckList = (list: DeckList) => {
	deck.value = list;
	isOpen.value = false;
	tab.value = DEFAULT_TAB;
};
</script>
