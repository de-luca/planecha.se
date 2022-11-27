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
        <label class="button is-fullwidth" :for="id + index" v-html="option.label"></label>
      </template>
    </div>

    <p class="help" v-html="currentHelp"></p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator';

export interface Option<T> {
  label?: string;
  value: T;
  help?: string;
}

@Component({ emits: ['update:modelValue'] })
export default class ButtonPicker extends Vue {
  @Prop({ required: true })
  public modelValue: string;
  @Prop({ required: false })
  public label?: string;
  @Prop({ required: true })
  public options: Array<Option<string>>;

  public id = Math.random().toString(36).substring(2, 15);

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
  width: 100%;
  .control {
    display: flex;
    gap: 1rem;

    label {
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
