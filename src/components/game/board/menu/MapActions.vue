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
</template>

<script setup lang="ts">
import { Eye, Play } from "lucide-vue-next";
import { computed, ref } from "vue";
import { Chaos, Planeswalk } from "@/components/svgs/symbols";
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
import { Phenomenon } from "@/model/card";
import { EternitiesMap } from "@/model/game/eternities";
import { RevealerMode, RevealerSource, StateKey } from "@/model/wall";
import { useMain } from "@/store/main";

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
