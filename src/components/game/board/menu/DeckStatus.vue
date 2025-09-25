<template>
  <HoverCard>
    <HoverCardTrigger title="Game stats">
      <Button variant="ghost" class="w-[3.5rem]">
        <MapIcon class="!h-full !w-full" />
      </Button>
    </HoverCardTrigger>
    <HoverCardContent side="right" class="w-[20rem] flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <MapPinned :size="20" /> Active Cards
          </div>
          <div>{{ active }}</div>
        </div>
        <Separator />
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Eye :size="20" /> Revealed Cards
          </div>
          <div>{{ revealed }}</div>
        </div>
        <Separator />
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Layers :size="20" /> Remaining Cards
          </div>
          <div v-if="remainingPhenomena === null">{{ remaining }}</div>
        </div>
        <div v-if="remainingPhenomena !== null" class="flex items-center justify-between">
          <div class="flex items-center gap-2 pl-6">
            Planes
          </div>
          <div>{{ remaining }}</div>
        </div>
        <div v-if="remainingPhenomena !== null" class="flex items-center justify-between">
          <div class="flex items-center gap-2 pl-6">
            Phenomena
          </div>
          <div>{{ remainingPhenomena }}</div>
        </div>
        <Separator />
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Skull :size="20" /> Played Cards
          </div>
          <div v-if="playedPhenomena === null">{{ played }}</div>
        </div>
        <div v-if="playedPhenomena !== null" class="flex items-center justify-between">
          <div class="flex items-center gap-2 pl-6">
            Planes
          </div>
          <div>{{ played }}</div>
        </div>
        <div v-if="playedPhenomena !== null" class="flex items-center justify-between">
          <div class="flex items-center gap-2 pl-6">
            Phenomena
          </div>
          <div>{{ playedPhenomena }}</div>
        </div>
    </HoverCardContent>
  </HoverCard>
</template>

<script setup lang="ts">
import { Eye, Layers, Map as MapIcon, MapPinned, Skull } from "lucide-vue-next";
import { computed } from "vue";

import { Button } from "@/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

import { DualDeck, EternitiesMap } from "@/model/game/eternities";
import { useMain } from "@/store/main";

const store = useMain();

const revealed = computed(
	() =>
		(store.game.revealed?.others.length ?? 0) +
		(store.game.revealed?.relevant.length ?? 0),
);
const active = computed(() =>
	store.game instanceof EternitiesMap
		? store.game.tiles.reduce((sum, t) => sum + t.plane.length, 0)
		: store.game.active.length,
);
const remaining = computed(() => store.game.remaining);
const played = computed(() => store.game.played.length);
const remainingPhenomena = computed(() =>
	store.game instanceof DualDeck ? store.game.remainingPhenomena : null,
);
const playedPhenomena = computed(() =>
	store.game instanceof DualDeck ? store.game.playedPhenomena.length : null,
);
</script>
