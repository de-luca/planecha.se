<template>
  <div class="relative w-fit">
    <MapPin v-if="current" class="absolute top-0 left-0 z-2"/>
    <Badge 
      v-if="counter !== undefined"
      class="absolute right-0 bottom-0 z-2"
    >
      {{ counterValue }}
    </Badge>
    <img 
      :src="buildImgSrc(card)"
      class="max-w-[800px] max-h-full w-full object-scale-down rounded-[3.5%/4.75%] drop-shadow-[1px_1px_1px_#585858]"
    />
  </div>
</template>

<script setup lang="ts">
import { MapPin } from "lucide-vue-next";
import { computed } from "vue";

import { Badge } from "@/components/ui/badge";

import { Plane } from "@/model/card";
import { useMain } from "@/store";
import { buildImgSrc } from "@/utils/img";

const {
	card,
	current = false,
	hasStarted = true,
} = defineProps<{
	card: Plane;
	current?: boolean;
	hasStarted?: boolean;
}>();

const store = useMain();

const counter = computed(() =>
	card instanceof Plane ? card.counter : undefined,
);

const counterValue = computed({
	get: () => counter?.value?.value,
	set: (value) => {
		const change = (value ?? 0) - (counter.value?.value ?? 0);
		if (change !== 0) {
			store.updateCounters({ planeId: card.id, change });
		}
	},
});
</script>

<!-- <script lang="ts">
import { Component, Prop } from "vue-facing-decorator";
import { Imgable } from "@/components/Imgable";
import { type Counter, Plane } from "@/model/card";
import { useMain } from "@/store/main";

@Component
export default class Card extends Imgable {
	@Prop({ required: true })
	public card: Plane;
	@Prop({ required: false, default: false })
	public current: boolean;
	@Prop({ required: false, default: true })
	public hasStarted: boolean;

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

	public update(change: number): void {
		this.store.updateCounters({ planeId: this.card.id, change });
	}
}
</script> -->

<!-- <style lang="scss" scoped>
.card-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

img {
  border-radius: var(--card-radius);
  max-height: 100%;
}

.counters {
  position: absolute;
  z-index: 3;

  &.active {
    top: -.5rem;
    right: -.5rem;

    .tag {
      &.minus, &.plus {
        cursor: pointer;
        width: 1.5rem;
      }

      &.value {
        width: 2rem;
      }
    }
  }

  &.inactive {
    width: 2rem;
    top: -.5rem;
    right: -.5rem;
  }
}
</style> -->
