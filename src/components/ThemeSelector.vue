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

type theme = 'sys' | 'drk' | 'lgt';

export default class ThemeSelector extends Vue {
  private static readonly icons: Record<theme, string> = {
    sys: 'cog',
    drk: 'moon',
    lgt: 'sun',
  };

  private currentTheme: theme = 'sys';

  public created() {
    this.currentTheme = localStorage.getItem('theme') as theme ?? 'sys';
  }

  public get icon(): string {
    return ThemeSelector.icons[this.currentTheme];
  }

  public get theme(): theme {
    return this.currentTheme;
  }

  public set theme(theme: theme) {
    this.currentTheme = theme;
    this.storeTheme();
    this.applyTheme();
  }

  private storeTheme(): void {
    localStorage.setItem('theme', this.currentTheme);
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
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
