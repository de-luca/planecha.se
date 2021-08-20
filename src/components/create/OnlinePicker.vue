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
    if (!this.available) {
      return 'Online unavailable. 🔥 Server is dead 🔥';
    }

    if (this.loading) {
      return 'Checking the Planar Beacon...';
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
    width: 250px;
  }

  .control {
    display: inline-flex;
    gap: 1rem;

    label {
      width: 250px;
    }
  }
}

input[type="radio"] {
  display: none;

  &:checked+label {
    border-color: #4a4a4a;
    color: #363636;
  }
  &:disabled+label {
    background-color: white;
    border-color: #dbdbdb;
    box-shadow: none;
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
