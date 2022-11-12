<template>
  <a :href="href" rel="noopener noreferrer" target="_blank">
    <slot></slot>
  </a>
</template>

<script lang="ts" setup>
defineProps({ href: String })
</script>
