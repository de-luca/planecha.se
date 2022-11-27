<template>
  <div class="panel-block static">
    <p class="control has-icons-right">
      <input
        @keypress.enter.prevent
        class="input"
        type="text"
        placeholder="Search for a deck"
        v-model="search"
      >
      <span class="icon is-right">
        <button @click.prevent="search = ''" class="delete"></button>
      </span>
    </p>
  </div>
  <div class="deck-list">
    <template v-for="[name, deck] in savedDecks" :key="name">
      <div class="panel-block" :class="{ disabled: scope !== 'all' && deck.scope !== scope }">
        <span><strong>{{ name }}</strong></span>
        <span>{{ deck.list.length }} cards</span>
        <span>
          <span class="tag is-light">{{ getTag(deck.scope) }}</span>
        </span>

        <button
          @click.prevent="deleteDeck(name)"
          class="button is-small del"
        >Delete</button>
        <feedback-button
          @click.prevent="useDeck(name)"
          class="button is-small apply"
          idleText="Apply"
          actionText="Applied!"
          timeout="1000"
          :disabled="scope !== 'all' && deck.scope !== scope"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { SavedDeck, Scope, scopeMap } from '../types';
import { useMain } from '@/store/main';
import { Card } from '@/model/card';
import { CardProvider } from '@/services/CardProvider';

import FeedbackButton from '@/components/FeedbackButton.vue';

const TAGS = {
  all: 'Planes and Phenomena',
  planes: 'Only Planes',
  phenomena: 'Only Phenomena',
};

@Component({
  emits: ['use'],
  components: { FeedbackButton },
})
export default class DeckList extends Vue {
  @Prop({ required: true })
  public scope: Scope;

  private store = useMain();
  private cards: Array<Card> = CardProvider.getAllCards();
  public search = '';

  public get savedDecks(): Map<string, SavedDeck> {
    return new Map(
      [...this.store.decks]
        .filter(([k]) => k.toLowerCase().includes(this.search)),
    );
  }

  public getTag(scope: Scope): string {
    return TAGS[scope];
  }

  public deleteDeck(name: string): void {
    this.store.removeDeck(name);
  }

  public useDeck(name: string): void {
    const list = (this.store.decks.get(name) as SavedDeck).list;
    this.$emit(
      'use',
      this.cards
        .filter(c => c instanceof scopeMap[this.scope])
        .filter(c => list.findIndex(id => id === c.id) !== -1),
    );
  }
}
</script>

<style lang="scss" scoped>
.panel-tabs:not(:last-child), .panel-block:not(:last-child) {
  border-bottom-color: var(--border-color);
}

.panel-block {
  color: var(--text-color);
  gap: 5px;

  &.disabled {
    opacity: 20%;
  }

  &.static:hover {
    background-color: unset;
  }

  &:last-child {
    border-radius: unset;
  }

  &:hover {
    background-color: var(--secondary);
  }

  input {
    border-color: var(--border-color);
  }

  button.button {
    color: var(--text-color);
    background-color: var(--bg-color);
    border-color: var(--border-color);
    width: 4rem;

    &:hover {
      border-color: #b5b5b5;
    }

    &.del {
      color: var(--btn-danger-color);
      background-color: var(--btn-danger-bg);
      border-color: var(--btn-danger-border);

      &:hover {
        color: var(--btn-danger-color);
        background-color: var(--btn-danger-hover-bg);
      }

      &:active {
        color: var(--btn-danger-color);
        background-color: var(--btn-danger-active-bg);
      }
    }
  }

  span {
    flex: 1 1 0px;
    align-self: center;

    .tag {
      color: var(--secondary);
      background-color: var(--primary);
    }

    strong {
      color: var(--text-color);
    }
  }
}

.deck-list {
  height: calc(60vh + 3.5em);
  overflow: scroll;
  border-bottom: 1px solid var(--border-color);
}
</style>
