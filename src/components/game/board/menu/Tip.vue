<template>
  <tippy placement="right" :offset="[0, offset]" duration="0" appendTo="parent">
    <slot name="btn"></slot>
    <template #content>
      <div class="tip">
        <slot name="tip"></slot>
      </div>
    </template>
  </tippy>
</template>

<script lang="ts" setup>
defineProps({ offset: { type: Number, default: 20 } });
</script>

<style lang="scss" scoped>
.tip {
  border: 1px solid var(--border-color);
  padding: .5rem 1rem;
  background-color: var(--bg-color);
  border-radius: 6px;
  width: max-content;
}
</style>
