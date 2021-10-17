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
        :disabled="!available"
      >
      <label
        class="button"
        :class="{ 'is-loading': loading }"
        :for="id + 'online'"
      >
        Online
      </label>
    </div>

    <p class="help" v-html="helpText"></p>
  </div>
</template>

<script lang="ts">
import { Beacon } from '@/model/net/Beacon';
import { Options, Vue, prop } from 'vue-class-component';

class Props {
  public modelValue = prop<boolean>({ required: true });
}

@Options({
  emits: ['update:modelValue'],
})
export default class OnlinePicker extends Vue.with(Props) {
  private id: string = '';
  private loading = true;
  private available = false;

  public created(): void {
    this.id = Math.random().toString(36).substring(2, 15);
    Beacon.check()
      .then(state => this.available = state)
      .finally(() => this.loading = false);
  }

  public get helpText(): string {
    if (this.loading) {
      return 'Checking the Planar Beacon...';
    }

    if (!this.available) {
      return 'Online unavailable. 🔥 Server is dead 🔥';
    }

    return '';
  }

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
    display: inline-flex;
    gap: 1rem;

    label {
      width: var(--form-btn-width);
      color: var(--picker-text-color);
      background-color: var(--picker-bg-color);
      border-color: var(--picker-border-color);
    }
  }
}

input[type="radio"] {
  display: none;

  &:checked+label {
    border-color: var(--picker-checked-border-color);
  }

  &:disabled+label {
    box-shadow: none;
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
