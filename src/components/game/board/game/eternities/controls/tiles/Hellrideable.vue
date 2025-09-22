<template>
  <div>
    <Button
      title="Hellride"
      variant="ghost"
      class="h-min w-full"
      @click="emit('hellride')"
    >
      <Planeswalk class="[&_path]:fill-(--foreground)"/>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Planeswalk } from "@/components/svgs/symbols";
import { Button } from "@/components/ui/button";

const emit = defineEmits(["hellride"]);
</script>

<!-- <script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";
import type { Tile } from "@/model/game/eternities";

@Component({ emits: ["hellride"] })
export default class Hellrideable extends Vue {
	@Prop({ required: false })
	public tile?: Tile;
	@Prop({ required: true })
	public hidden: boolean;
}
</script> -->

<style lang="css" scoped>
svg {
  height: calc((((90vh - 6.5rem) - (6 * .5rem)) / 7) - 1rem);
  width: unset;
}
</style>

<!-- <style lang="scss" scoped>
.hellrideable {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;

  svg {
    max-height: calc((((90vh - 6.5rem) - (6 * .5rem)) / 7) - 1rem);

    path {
      fill: var(--brand-color-secondary);
    }
  }

  &:hover {
    svg path {
      fill: var(--brand-color-primary);
    }
  }
}
</style> -->
