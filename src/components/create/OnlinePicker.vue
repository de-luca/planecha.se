<template>
  <div class="field">
    <label class="label">Local or Online game?</label>

    <div class="control">
      <input
        :id="id + 'local'"
        type="radio"
        :value="false"
        v-model="selected"
      >
      <label class="button" :for="id + 'local'">Local</label>

      <input
        :id="id + 'online'"
        type="radio"
        :value="true"
        v-model="selected"
      >
      <label class="button" :for="id + 'online'">
        Online
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';

@Component({ emits: ['update:modelValue'] })
export default class OnlinePicker extends Vue {
  @Prop({ required: true })
  public modelValue: boolean;

  public id = Math.random().toString(36).substring(2, 15);

  public get selected(): boolean {
    return this.modelValue;
  }

  public set selected(value: boolean) {
    this.$emit('update:modelValue', value);
  }
}
</script>

<style lang="scss" scoped>
.field {
  button {
    width: var(--form-btn-width);
  }

  .control {
    display: flex;
    gap: 1rem;

    label {
      width: var(--form-btn-width);
      color: var(--picker-text);
      background-color: var(--picker-bg);
      border-color: var(--picker-border);
    }
  }
}

input[type="radio"] {
  display: none;

  &:checked+label {
    border-color: var(--picker-checked-border);
  }

  &:disabled+label {
    box-shadow: none;
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
