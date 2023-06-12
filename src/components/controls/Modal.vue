<template>
  <div class="modal" :class="{ scroll: props.scroll }">
    <div class="modal-background" title="Close" @click="emit('close')"></div>
    <div class="modal-content">
      <slot></slot>
    </div>
    <button class="modal-close is-large" aria-label="close" title="Close" @click="emit('close')"></button>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['close']);
const props = defineProps({ scroll: Boolean });
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  &.scroll {
    overflow-y: scroll;
    .modal-content {
      overflow-y: inherit;
    }
  }
}

.modal-content {
  max-width: 70vw;
  width: initial;
  overflow: visible;
}
</style>
