import { defineStore } from 'pinia'

type State = {
  theme: Theme;
  decks: Record<string, Array<string>>;
  name ?: string;
};

function getState(): State {
  return {
    theme: localStorage.getItem('theme') as Theme ?? 'sys',
    decks: {},
  };
}

export const useConfig = defineStore('config', {
  state: getState,

  actions: {
    setTheme(theme: Theme): void {
      this.theme = theme;
      localStorage.setItem('theme', this.theme);
    },

    setName(name: string): void {
      this.name = name;
      localStorage.setItem('name', this.name);
    },
    removeName(): void {
      this.name = undefined;
      localStorage.removeItem('name');
    },
  },
});
