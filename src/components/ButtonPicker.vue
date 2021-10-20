<template>
  <div class="field">
    <label class="label">{{ label }}</label>

    <div class="control">
      <template v-for="(option, index) in options" :key="option.value">
        <input
          type="radio"
          :id="id + index"
          :value="option.value"
          v-model="selected"
        >
        <label class="button" :for="id + index" v-html="option.label"></label>
      </template>
    </div>

    <p class="help" v-html="currentHelp"></p>
  </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

export interface Option<T> {
  label?: string;
  value: T;
  help?: string;
}

class Props {
  public modelValue = prop<string>({ required: true });
  public label = prop<string>({ required: false });
  public options = prop<Array<Option<string>>>({ required: true });
}

@Options({
  emits: ['update:modelValue'],
})
export default class ButtonPicker extends Vue.with(Props) {
  private id: string = '';

  public created(): void {
    this.id = Math.random().toString(36).substring(2, 15);
  }

  public get selected(): string {
    return this.modelValue;
  }

  public set selected(value: string) {
    this.$emit('update:modelValue', value);
  }

  public get currentHelp(): string {
    return this.options.find((o: Option<string>) => o.value === this.selected)?.help ?? '';
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
      color: var(--picker-color);
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
}
</style>
