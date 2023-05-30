<template>
  <button
    :title="title ?? 'Planeswalk'"
    @keyup.space.prevent
  >
    <Planeswalk class="icn" />
  </button>
</template>

<script lang="ts" setup>
import { Planeswalk } from '#/components/svgs';
defineProps({ title: String });
</script>
