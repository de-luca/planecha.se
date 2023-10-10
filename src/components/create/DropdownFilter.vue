<template>
  <div class="dropdown is-right" :class="{ 'is-active': active }">
    <div class="dropdown-trigger">
      <button @click.prevent="active = !active" class="button" aria-haspopup="true" aria-controls="dropdown-menu">
        <span>{{ title }}</span>
      </button>
    </div>
    <div v-if="active" class="click-trap" @click="active = false"></div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <label class="dropdown-item" @click.prevent="toggle">
          <input type="checkbox" :checked="full" :indeterminate="indeterminate">
          All / None
        </label>
        <hr class="dropdown-divider">
        <label v-for="o in options" class="dropdown-item">
          <input type="checkbox" v-model="selected" :value="o.value ?? o.label">
          <component v-if="o.icon" :is="o.icon" />
          {{ o.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator';
import { Component as VueComponent } from 'vue';

export interface Option {
  label: string;
  value?: string;
  icon?: VueComponent;
}

@Component({ emits: ['update:modelValue'] })
export default class DropdownFilter extends Vue {
  @Prop({ required: true })
  public modelValue: Array<string>;
  @Prop({ required: true })
  public title: string;
  @Prop({ required: true })
  public options: Array<Option>;

  public active = false;

  public get indeterminate(): boolean {
    return this.selected.length !== 0 &&
      this.selected.length < this.options.length;
  }

  public get full(): boolean {
    return this.selected.length === this.options.length;
  }

  public get selected(): Array<string> {
    return this.modelValue;
  }

  public set selected(value: Array<string>) {
    this.$emit('update:modelValue', value);
  }

  public toggle() {
    this.selected = this.selected.length === this.options.length
      ? []
      : this.options.map(o => o.value ?? o.label);
  }
}
</script>

<style lang="scss" scoped>
.click-trap {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: transparent;
  z-index: 3;
}

.dropdown .dropdown-trigger .button {
  color: var(--text-color);
  background-color: var(--bg-color);
  border-color: var(--border-color);

  &:hover {
    border-color: #b5b5b5;
  }

  &:focus {
    border-color: #485fc7;
    box-shadow: 0 0 0 .125em rgba(72, 95, 199, .25);
  }
}

.dropdown-content {
  color: var(--text-color);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);

  label.dropdown-item {
    color: var(--text-color);
    display: flex;
    flex-direction: row;
    align-items: center;

    padding-right: 3rem;
    text-align: inherit;
    white-space: nowrap;
    width: 100%;

    gap: .5rem;

    &:hover {
      background-color: var(--secondary);
    }

    svg {
      fill: var(--brand-color-primary);
      height: 1.2rem;
      vertical-align: middle;
    }
  }
}
</style>
