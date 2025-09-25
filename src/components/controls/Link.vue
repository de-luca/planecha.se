<template>
  <a class="underline underline-offset-4" :href="href" rel="noopener noreferrer" target="_blank">
    <slot></slot>
  </a>
</template>

<script lang="ts" setup>
defineProps({ href: String });
</script>
