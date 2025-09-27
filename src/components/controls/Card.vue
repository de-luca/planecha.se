<template>
  <div class="outer relative w-fit">
    <img v-if="hidden"
      src="/cards/back.jpg"
      class="max-w-[800px] max-h-full w-full rounded-[3.5%/4.75%] drop-shadow-[1px_1px_1px_#585858]"
    />
    <template v-else>
      <NumberField 
        v-if="counter !== undefined" 
        class="w-[10rem] absolute right-0 -top-10" 
        :default-value="counter.start" 
        :min="0"
        v-model="counterValue"
        :disabled="ro"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
      <img 
        :src="buildImgSrc(card)"
        class="inner h-full w-full rounded-[3.5%/4.75%] drop-shadow-[1px_1px_1px_#585858]"
        :class="{ '!drop-shadow-[0_0_5px_#DC143C,0_0_5px_#DC143C,0_0_5px_#DC143C]': card instanceof Phenomenon }"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import {
	NumberField,
	NumberFieldContent,
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
} from "@/components/ui/number-field";
import { type Card, Phenomenon, Plane } from "@/model/card";
import { useMain } from "@/store/main";
import { buildImgSrc } from "@/utils/img";

const {
	card,
	hidden = false,
	ro = false,
} = defineProps<{
	card: Card;
	hidden?: boolean;
	ro?: boolean;
}>();

const store = useMain();

const counter = computed(() =>
	card instanceof Plane ? card.counter : undefined,
);

const counterValue = computed({
	get: () => counter.value?.value,
	set: (value) => {
		const change = (value ?? 0) - (counter.value?.value ?? 0);
		if (change !== 0) {
			store.updateCounters({ planeId: card.id, change });
		}
	},
});
</script>
