<template>
  <button
    class="button is-ghost planeswalk-btn"
    :title="title ?? 'Planeswalk'"
  >
    <Planeswalk class="icn is-primary" />
  </button>
</template>

<script lang="ts" setup>
import Planeswalk from '#/components/svgs/Planeswalk.vue';
defineProps({ title: String });
</script>

<style lang="scss">
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
