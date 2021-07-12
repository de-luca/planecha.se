<template>
  <div class="field">
    <label class="label">Local or online game?</label>

    <div class="control">
      <input
        :id="id + 'local'"
        type="radio"
        value="local"
        v-model="selected"
      >
      <label class="button" :for="id + 'local'">Local</label>

      <input
        :id="id + 'online'"
        type="radio"
        value="online"
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

    <p class="help" v-if="!available">Online unavailable. Server is dead.</p>
  </div>
</template>

<script lang="ts">
import { Beacon } from '@/model/net/Beacon';
import { Options, Vue, prop } from 'vue-class-component';

export enum GameScope {
  LOCAL = 'local',
  ONLINE = 'online',
}

class Props {
  public modelValue = prop<string>({ required: true });
}

@Options({
  emits: ['update:modelValue'],
})
export default class GameScopePicker extends Vue.with(Props) {
  private id: string = '';
  private loading = true;
  private available = false;

  public created(): void {
    this.id = Math.random().toString(36).substring(2, 15);
    Beacon.check()
      .then(state => this.available = state)
      .finally(() => this.loading = false);
  }

  public get selected(): string {
    return this.modelValue;
  }

  public set selected(value: string) {
    this.$emit('update:modelValue', value);
  }
}
</script>

<style lang="scss" scoped>
.field {
  button {
    width: 150px;
  }

  .control {
    display: inline-flex;
    gap: 1rem;

    label {
      width: 150px;
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
