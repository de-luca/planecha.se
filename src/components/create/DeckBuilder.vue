<template>
  <div class="modal" style="display: block">
    <div class="modal-background"></div>
    <div class="modal-content">
      <h1 class="title">Deck Customization</h1>

      <nav class="panel">
        <p class="panel-tabs" v-if="group === 'all'">
          <a @click="selectedGroup = 'all'" :class="{'is-active': selectedGroup === 'all'}">All</a>
          <a @click="selectedGroup = 'plane'" :class="{'is-active': selectedGroup === 'plane'}">Planes</a>
          <a @click="selectedGroup = 'phenomenon'" :class="{'is-active': selectedGroup === 'phenomenon'}">Phenomenon</a>
        </p>
        <div class="panel-block">
          <a @click="all" class="button">All</a>
          <a @click="none" class="button">None</a>
          <p class="control has-icons-right">
            <input @keypress.enter.prevent class="input" type="text" placeholder="Search" v-model="search">
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
      </nav>

      <button
        class="button is-primary"
        @click.prevent="done"
      >
        Use this Deck
      </button>
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

export enum Group {
  ALL = 'all',
  PLANES = 'plane',
  PHENOMENA = 'phenomenon',
}

class Props {
  public baseDeck = prop<Array<Card>>({ required: false, default: [] });
  public group = prop<Group>({ required: true });
}

@Options({
  emits: ['done'],
})
export default class DeckBuilder extends Vue.with(Props) {
  private selectedGroup: Group = this.group;
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
      .filter(c => this.selectedGroup === Group.ALL || c.type === this.selectedGroup)
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
}
</script>

<style lang="scss" scoped>
.modal-content {
  width: 800px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1.title {
    text-align: center;
    color: whitesmoke;
  }
}

.panel {
   background-color: white;

  .panel-tabs {
    font-size: 1em;
  }
  .panel-block {
    gap: 5px;
  }
  .card-list {
    height: 60vh;
    overflow: scroll;
  }
}
</style>
