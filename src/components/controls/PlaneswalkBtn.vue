<template>
  <button
    class="button is-ghost planeswalk-btn"
    :title="title ?? 'Planeswalk'"
  >
    <Planeswalk class="icn is-primary" />
  </button>
</template>

<script lang="ts" setup>
import Planeswalk from '#/components/svgs/dices/Planeswalk.vue';
defineProps({ title: String });
</script>

<style lang="scss" scoped>
.planeswalk-btn {
  height: 6rem;

  svg path {
    fill: var(--brand-color-secondary);
  }

  &:hover svg path {
    fill: var(--brand-color-primary);
  }
}
</style>
