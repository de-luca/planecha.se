<template>
  <img v-if="hidden"
    src="/cards/back.jpg"
    class="max-w-[800px] max-h-full w-full rounded-[3.5%/4.75%] drop-shadow-[1px_1px_1px_#585858]"
  />
  <div v-else class="outer relative w-fit">
    <NumberField 
      v-if="counter !== undefined" 
      class="w-[10rem] absolute right-0 -top-10" 
      :default-value="counter.start" 
      :min="0"
      v-model="counterValue"
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

import { useMain } from "@/store/main";
import { buildImgSrc } from "../../utils/img";

import { type Card, Phenomenon, Plane } from "@/model/card";

const {
	card,
	hidden = false,
	ro = false,
} = defineProps<{
	card: Card;
	hidden?: boolean;
	ro?: boolean;
}>();

const counter = card instanceof Plane ? card.counter : undefined;

const store = useMain();

const counterValue = computed({
	get: () => counter?.value,
	set: (value) => {
		const change = (value ?? 0) - (counter?.value ?? 0);
		if (change !== 0) {
			store.updateCounters({ planeId: card.id, change });
		}
	},
});
</script>

<!-- <script lang="ts">
import { Component, Prop } from "vue-facing-decorator";
import { Imgable } from "@/components/Imgable";
import {
	type Counter,
	type Card as ModelCard,
	Phenomenon,
	Plane,
} from "@/model/card";
import { useMain } from "@/store/main";

@Component
export default class Card extends Imgable {
	@Prop({ required: true })
	public card: ModelCard;
	@Prop({ required: false, default: false })
	public hidden: boolean;
	@Prop({ required: false, default: false })
	public ro: boolean;

	private store = useMain();

	public get imgSrc(): string {
		return this.buildImgSrc(this.card);
	}

	public get counters(): Counter | undefined {
		if (this.card instanceof Plane) {
			return this.card.counter;
		}
		return undefined;
	}

	public get isPhenomenon(): boolean {
		return this.card instanceof Phenomenon;
	}

	public update(change: number) {
		this.store.updateCounters({ planeId: this.card.id, change });
	}
}
</script> -->

<!-- <style lang="scss" scoped>
.card-container {
  height: inherit;
  width: fit-content;
  position: relative;
}

img {
  width: 100%;
  max-height: 100%;
  max-width: 800px;
  filter: drop-shadow(1px 1px 1px #585858);
  border-radius: var(--card-radius);
  object-fit: scale-down;

  &.phenomenon {
    filter:
      drop-shadow(0 0 5px #DC143C)
      drop-shadow(0 0 5px #DC143C)
      drop-shadow(0 0 5px #DC143C)
    ;
  }
}

.counters {
  position: absolute;
  right: 0;
  top: -1.75rem;
  z-index: 10;

  .tag {
    font-weight: bolder;

    &.value {
      width: 2rem;
    }

    &.minus, &.plus {
      cursor: pointer;
    }
  }
}
</style> -->
