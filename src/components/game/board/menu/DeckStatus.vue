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


  <!-- <span>{{ played }}</span>
            <span v-if="playedPhenomena == null"> | {{ playedPhenomena ?? 0 }}</span> -->


  <!-- <div class="wrapper">
    <tip>
      <template #btn>
        <div class="info" title="Remaining cards">
          <fa icon="map" fixed-width size="lg" />
          {{ active }}
        </div>
      </template>
      <template #tip>Active cards</template>
    </tip>

    <tip>
      <template #btn>
        <div class="info" title="Remaining cards">
          <fa icon="eye" fixed-width size="lg" transform="shrink-5" mask="map"/>
          {{ revealed }}
        </div>
      </template>
      <template #tip>Revealed cards</template>
    </tip>

    <tip>
      <template #btn>
        <div class="info" title="Remaining cards">
          <fa icon="layer-group" fixed-width size="lg" />
          <div>
            <span>{{ remaining }}</span>
            <span v-if="remainingPhenomena !== null">{{ remainingPhenomena }}</span>
          </div>
        </div>
      </template>
      <template #tip>
        <div class="description">
          <div>Remaining cards</div>
          <div v-if="remainingPhenomena !== null">
            <span>Planes</span>
            <span>Phenomena</span>
          </div>
        </div>
      </template>
    </tip>

    <tip>
      <template #btn>
        <div class="info" title="Played cards">
          <fa icon="skull" fixed-width size="lg" transform="shrink-4" mask="layer-group"/>
          <div>
            <span>{{ played }}</span>
            <span v-if="playedPhenomena !== null">{{ playedPhenomena }}</span>
          </div>
        </div>
      </template>
      <template #tip>
        <div class="description">
          <div>Played cards</div>
          <div v-if="playedPhenomena !== null">
            <span>Planes</span>
            <span>Phenomena</span>
          </div>
        </div>
      </template>
    </tip>
  </div> -->
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

<!-- <script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { DualDeck, EternitiesMap } from "@/model/game/eternities";
import { useMain } from "@/store/main";

@Component
export default class DeckStatus extends Vue {
	private store = useMain();

	public get revealed(): number {
		return (
			(this.store.game.revealed?.others.length ?? 0) +
			(this.store.game.revealed?.relevant.length ?? 0)
		);
	}

	public get active(): number {
		if (this.store.game instanceof EternitiesMap) {
			return this.store.game.tiles.reduce((sum, t) => sum + t.plane.length, 0);
		}

		return this.store.game.active.length;
	}

	public get remaining(): number {
		return this.store.game.remaining;
	}

	public get played(): number {
		return this.store.game.played.length;
	}

	public get remainingPhenomena(): number | null {
		return this.store.game instanceof DualDeck
			? this.store.game.remainingPhenomena
			: null;
	}

	public get playedPhenomena(): number | null {
		return this.store.game instanceof DualDeck
			? this.store.game.playedPhenomena.length
			: null;
	}
}
</script> -->

<!-- <style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: .5rem;

  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: calc(0.5em - 1px) 1em;

    div:nth-child(2) {
      display: flex;
      flex-direction: row;
      gap: .5rem;

      span:nth-child(2) {
        color: red;
      }
    }
  }

  .description {
    display: flex;
    flex-direction: column;
    align-items: center;

    div:nth-child(2) {
      display: flex;
      flex-direction: row;
      gap: .5rem;

      span:nth-child(2) {
        color: red;
      }
    }
  }
}
</style>@/model/game/eternities -->
