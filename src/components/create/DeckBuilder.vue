<template>
  <div class="modal" style="display: block">
    <div class="modal-background"></div>
    <div class="modal-content">
      <h1 class="title">Deck Customization</h1>

      <div class="panel">
        <p class="panel-tabs" >
          <a
            v-if="scope === 'all'"
            @click="selectedGroup = 'all'"
            :class="{'is-active': selectedGroup === 'all'}"
          >All cards</a>
          <a
            @click="selectedGroup = 'plane'"
            :class="{'is-active': selectedGroup === 'plane'}"
          >Planes</a>
          <a
            v-if="scope === 'all'"
            @click="selectedGroup = 'phenomenon'"
            :class="{'is-active': selectedGroup === 'phenomenon'}"
          >Phenomenon</a>
          <span></span>
          <a @click="selectedGroup = 'decks'" :class="{'is-active': selectedGroup === 'decks'}">Decks</a>
        </p>

        <template v-if="selectedGroup === 'decks'">
          <keep-alive>
            <deck-list :scope="scope" @use="setDeck"/>
          </keep-alive>
        </template>

        <template v-else>
          <div class="panel-block static">
            <a @click="all" class="button all">All</a>
            <a @click="none" class="button none">None</a>
            <p class="control has-icons-right">
              <input
                @keypress.enter.prevent
                class="input"
                type="text"
                placeholder="Search a card"
                v-model="search"
              >
              <span class="icon is-right">
                <button @click.prevent="search = ''" class="delete"></button>
              </span>
            </p>
          </div>
          <div class="card-list">
            <template v-for="card in filtered" :key="card.id">
              <label class="panel-block">
                <span class="panel-icon">
                  <input type="checkbox" :value="card" v-model="deck">
                </span>
                <span>{{ card.name }}</span>
              </label>
            </template>
          </div>
          <save-deck
            :deck="deck"
            :scope="scope"
            class="panel-block static"
          />
        </template>
      </div>

      <div class="field">
        <div class="control">
          <button class="button is-fullwidth is-secondary" @click.prevent="done">
            Use this Deck
          </button>
        </div>
      </div>

    </div>

     <button
      class="modal-close is-large"
      aria-label="cancel and close"
      @click.prevent="cancel"
    ></button>
  </div>
</template>

<script lang="ts">
import { Container } from 'typedi';
import { Options, prop, Vue } from 'vue-class-component';
import { DeckProvider } from '@/services/DeckProvider';
import { Card } from '@/model/card';
import { Scope } from './builder/types';

import SaveDeck from './builder/SaveDeck.vue';
import DeckList from './builder/DeckList.vue';

class Props {
  public baseDeck = prop<Array<Card>>({ required: false, default: [] });
  public scope = prop<Scope>({ required: true });
}

@Options({
  emits: ['done'],
  components: { DeckList, SaveDeck },
})
export default class DeckBuilder extends Vue.with(Props) {
  private selectedGroup: Scope = this.scope;
  private deckProvider: DeckProvider;
  private cards: Array<Card>;
  private search: string = '';
  private deck: Array<Card> = [];

  public created() {
    this.deckProvider = Container.get(DeckProvider);
    this.cards = this.deckProvider.getAllCards();
    this.deck = [...this.baseDeck];
  }

  public mounted() {
    if (this.baseDeck.length === 0) {
      this.all();
    }
  }

  public get filtered(): Array<Card> {
    return this.cards
      .filter(c => this.selectedGroup === Scope.ALL || c.type === this.selectedGroup)
      .filter(c => c.name.toLowerCase().includes(this.search));
  }

  public all(): void {
    this.deck = [...this.filtered, ...this.deck].reduce(
      (acc, c) => {
        if (acc.findIndex(accC => accC.id === c.id) === -1) {
          acc.push(c);
        }
        return acc;
      },
      [] as Array<Card>,
    );
  }

  public none(): void {
    this.deck = this.deck.filter((c) => {
      return this.filtered.findIndex(fc => fc.id === c.id) === -1;
    });
  }

  public cancel(): void {
    this.$emit('done', this.baseDeck);
  }

  public done(): void {
    this.$emit('done', this.deck);
  }

  public setDeck(deck: Array<Card>): void {
    this.deck = deck;
  }
}
</script>

<style lang="scss" scoped>
.modal-content {
  max-width: 800px;
  max-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: .5rem;
  margin: 0 auto;

  h1.title {
    text-align: center;
    color: whitesmoke;
  }
}

.button.all, .button.none, .button.save {
  color: var(--text-color);
  background-color: var(--bg-color);
  border-color: var(--border-color);

  &:hover {
    border-color: #b5b5b5;
  }

  &:focus {
    border-color: #485fc7;
    box-shadow: 0 0 0 .125em rgba(72,95,199,.25);
  }
}

.panel {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);

  .panel-tabs:not(:last-child), .panel-block:not(:last-child) {
    border-bottom-color: var(--border-color);
  }

  .panel-tabs {
    font-size: 1em;
    padding-left: 1rem;
    padding-right: 1rem;

    a {
      border-bottom-color: var(--border-color);

      &.is-active {
        color: var(--text-color);
        border-bottom-color: var(--primary);
      }
    }

    span {
      flex-grow: 1;
    }
  }

  .panel-block {
    color: var(--text-color);
    gap: 5px;

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
  }

  .card-list {
    height: 60vh;
    overflow: scroll;
    border-bottom: 1px solid var(--border-color);
  }
}
</style>
