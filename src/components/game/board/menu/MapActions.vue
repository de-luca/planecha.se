<template>
  <div class="h-[10rem] flex flex-col items-center justify-center gap-1">

    <template v-if="store.game.hasStarted">
      <Button 
        v-if="!isEternities"
        variant="ghost" 
        class="w-[3.5rem]"
        :title="isPhenomenon ? 'Resolve' : 'Planeswalk'"
        @click="$emit('planeswalk')"
      >
        <Planeswalk 
          class="!h-[3.5rem] [&_path]:fill-(--foreground)"
          :class="{ 'animate-shake !drop-shadow-[0_0_5px_#DC143C,0_0_5px_#DC143C,0_0_5px_#DC143C]': isPhenomenon }"
        />
      </Button>

      <Button 
        variant="ghost"
        class="w-[3.5rem]"
        title="Chaos"
        @click="$emit('chaos')"
      >
        <Chaos class="!w-[1.5rem] [&_path]:fill-(--foreground)" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" class="w-[3.5rem]" title="Look at the top cards of the planar deck">
            <Eye class="!h-full !w-full"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-[15rem]" side="right">
          <DropdownMenuLabel>
            <Label for="age">Look at the top cards of the planar deck.</Label>
          </DropdownMenuLabel>
          <DropdownMenuLabel class="flex justify-between gap-1">
            <NumberField id="age" :default-value="2" :min="0" v-model="lookAtCount">  
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
            <Button variant="outline" size="icon" @click="look">
              <Eye />
            </Button>
          </DropdownMenuLabel>
          <DropdownMenuLabel class="text-muted-foreground text-xs">
            Useful with <l href="https://scryfall.com/card/who/110/susan-foreman">Susan Foreman</l>.
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>

    <Button 
      v-else
      variant="ghost" 
      class="w-[3.5rem] h-[2.5rem]"
      @click="store.startGame()"
      title="Start Game"
    >
      <Play class="!h-full !w-full animate-shake"/>
    </Button>
  </div>
  
  <!-- <div class="actions">
    <template v-if="store.game.hasStarted">
      <tip v-if="!isEternities">
        <template #btn>
          <button
            class="planeswalk button is-ghost"
            :title="isPhenomenon ? 'Resolve' : 'Planeswalk'"
            :disabled="disabled"
            @click="$emit('planeswalk')"
          >
            <Planeswalk
              class="icn"
              :class="{ 'fa-shake': isPhenomenon, 'is-phenomenon': isPhenomenon }"
            />
          </button>
        </template>
        <template #tip>{{ isPhenomenon ? 'Resolve' : 'Planeswalk' }}</template>
      </tip>
      <tip>
        <template #btn>
          <button
            class="chaos button is-ghost"
            :disabled="disabled || isPhenomenon"
            @click="$emit('chaos')"
          >
            <Chaos class="icn" />
          </button>
        </template>
        <template #tip>{{ isPhenomenon ? 'Chaos not available' : 'Chaos' }}</template>
      </tip>
      <LookAtBtn :disabled="disabled || isPhenomenon" />
    </template>
    <tip v-else>
      <template #btn>
        <button class="" @click="store.startGame()">
          <Play />
        </button>
      </template>
      <template #tip>Start game</template>
    </tip>
  </div> -->
</template>

<script setup lang="ts">
import { Eye, Play } from "lucide-vue-next";
import { computed, ref } from "vue";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
	NumberField,
	NumberFieldContent,
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
} from "@/components/ui/number-field";

import { Chaos, Planeswalk } from "@/components/svgs/symbols";

import { useMain } from "@/store/main";

import { Phenomenon } from "@/model/card";
import { EternitiesMap } from "@/model/game/eternities";
import { RevealerMode, RevealerSource, StateKey } from "@/model/wall";

defineEmits(["planeswalk", "chaos"]);
const { disabled } = defineProps<{ disabled: boolean }>();

const store = useMain();

const lookAtCount = ref(2);

const isEternities = computed(() => store.game instanceof EternitiesMap);
const isPhenomenon = computed(() => store.game.active[0] instanceof Phenomenon);

const look = () => {
	store.privateReveal({ count: lookAtCount.value });
	store.game.walls.set(StateKey.REVEALER, {
		tagline: "You are privately looking at cards",
		title: `Look at the top ${lookAtCount.value} cards of your planar deck`,
		source: RevealerSource.CUSTOM,
		component: RevealerMode.SCRY,
		sendShownTo: "bottom",
		initiator: "",
	});
};
</script>

<!-- <script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";
import { Phenomenon } from "@/model/card";
import { EternitiesMap } from "@/model/game/eternities";
import { useMain } from "@/store/main";
import LookAtBtn from "./LookAtBtn.vue";

import { Chaos, Planeswalk } from "@/components/svgs";

@Component({
	emits: ["chaos", "planeswalk"],
	components: { Chaos, Planeswalk, LookAtBtn },
})
export default class MapActions extends Vue {
	@Prop({ required: true })
	public disabled: boolean;

	private store = useMain();

	public get isEternities(): boolean {
		return this.store.game instanceof EternitiesMap;
	}

	public get hasStarted(): boolean {
		return this.store.game.hasStarted;
	}

	public get isPhenomenon(): boolean {
		return this.store.game.active[0] instanceof Phenomenon;
	}

	public start() {
		this.store.startGame();
	}
}
</script> -->

<!-- <style lang="scss" scoped>
.actions {
  height: 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .planeswalk, .chaos {
    svg path {
      fill: var(--brand-color-secondary);
    }
    &:hover svg path {
      fill: var(--brand-color-primary);
    }
  }

  .planeswalk {
    height: 3.5rem;

    .icn.is-phenomenon {
      filter:
        drop-shadow(0 0 5px #DC143C)
        drop-shadow(0 0 5px #DC143C)
        drop-shadow(0 0 5px #DC143C)
      ;
    }
  }

  .chaos svg {
    width: 1.5rem;
  }
}
</style> -->
