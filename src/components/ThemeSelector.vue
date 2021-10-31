<template>
  <div class="theme-selector">
    <label>
      <span class="pre">
        <fa :icon="icon" fixed-width />
      </span>
      <select v-model="theme">
        <option value="sys">System</option>
        <option value="drk">Dark</option>
        <option value="lgt">Light</option>
      </select>
      <span class="post">
        <fa icon="sort" fixed-width />
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { useConfig } from '@/store/config';

export default class ThemeSelector extends Vue {
  private static readonly icons: Record<Theme, string> = {
    sys: 'cog',
    drk: 'moon',
    lgt: 'sun',
  };

  private store = useConfig();

  public get icon(): string {
    return ThemeSelector.icons[this.theme];
  }

  public get theme(): Theme {
    return this.store.theme;
  }

  public set theme(theme: Theme) {
    this.store.setTheme(theme);
    this.applyTheme();
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.theme);
  }
}
</script>

<style lang="scss" scoped>
.theme-selector {
  position: relative;
  width: max-content;
  font-size: initial;
  line-height: 1.5;

  &.is-full-height {
    span, select {
      height: 100%;
      font-size: 1rem;
    }
  }

  span {
    position: absolute;
    pointer-events: none;
    z-index: 1;
    color: var(--text-color);
    cursor: pointer;
    padding-bottom: calc(0.5em - 1px);
    padding-left: .5em;
    padding-right: .5em;
    padding-top: calc(0.5em - 1px);
    font-size: 0.75rem;
    border: 1px solid transparent;
    height: 2.5em;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    &.pre {
      left: 0;
    }

    &.post {
      right: 0;
    }
  }

  select {
    -webkit-appearance: none;

    color: var(--btn-secondary-color);
    background-color: var(--btn-secondary-bg);
    border-color: var(--btn-secondary-border);

    border-radius: 4px;
    padding-left: 2rem;
    padding-right: 2rem;
    cursor: pointer;
    font-size: .75rem;
    height: 2.5em;
    appearance: none;

    &:hover {
      background-color: var(--btn-secondary-hover-bg);
    }

    &:active {
      background-color: var(--btn-secondary-active-bg);
    }
  }
}
</style>
