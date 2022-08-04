import { defineStore } from 'pinia';
import { SavedDeck } from '@/components/create/types';

type State = {
  theme: Theme;
  decks: Map<string, SavedDeck>;
  name?: string;
};

function getState(): State {
  const serializedDecks = localStorage.getItem('decks');

  return {
    theme: localStorage.getItem('theme') as Theme ?? 'sys',
    decks: serializedDecks !== null
      ? new Map(JSON.parse(serializedDecks) as Array<[string, SavedDeck]>)
      : new Map(),
    name: localStorage.getItem('name') ?? undefined,
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

    addDeck(name: string, deck: SavedDeck): void {
      this.decks.set(name, deck);
      localStorage.setItem(
        'decks',
        JSON.stringify(Array.from(this.decks.entries())),
      );
    },
    removeDeck(name: string): void {
      this.decks.delete(name);
      localStorage.setItem(
        'decks',
        JSON.stringify(Array.from(this.decks.entries())),
      );
    },
  },
});
