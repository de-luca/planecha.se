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

<style lang="css" scoped>
svg {
  height: calc((((90vh - 6.5rem) - (6 * .5rem)) / 7) - 1rem);
  width: unset;
}
</style>
