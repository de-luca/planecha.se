<template>
  <div class="modal" style="display: block">
    <div class="modal-background"></div>
    <div class="modal-content">

      <h1 class="title">Deck Customization</h1>

      <aside class="menu">
        <ul class="menu-list">
          <li>
            <a
              v-if="scope === 'all'"
              @click="selectedGroup = 'all'"
              :class="{'is-active': selectedGroup === 'all'}"
            >All cards</a>
          </li>
          <li>
            <a
              @click="selectedGroup = 'planes'"
              :class="{'is-active': selectedGroup === 'planes'}"
            >Planes</a>
          </li>
          <li>
            <a
              v-if="scope === 'all'"
              @click="selectedGroup = 'phenomena'"
              :class="{'is-active': selectedGroup === 'phenomena'}"
            >Phenomenon</a>
          </li>
          <li>
            <a
              @click="selectedGroup = 'decks'"
              :class="{'is-active': selectedGroup === 'decks'}"
            >Decks</a>
          </li>
        </ul>
      </aside>

      <div class="panel">
        <p class="panel-tabs" >
          <a
            v-if="scope === 'all'"
            @click="selectedGroup = 'all'"
            :class="{'is-active': selectedGroup === 'all'}"
          >All cards</a>
          <a
            @click="selectedGroup = 'planes'"
            :class="{'is-active': selectedGroup === 'planes'}"
          >Planes</a>
          <a
            v-if="scope === 'all'"
            @click="selectedGroup = 'phenomena'"
            :class="{'is-active': selectedGroup === 'phenomena'}"
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
              <tippy placement="bottom-end" duration="0" touch="false" hideOnClick="false">
                <label class="panel-block">
                  <span class="panel-icon">
                    <input type="checkbox" :value="card" v-model="deck">
                  </span>
                  <span>{{ card.name }}</span>
                </label>

                <template #content>
                  <img class="card-preview" :src="buildImgSrc(card)">
                </template>
              </tippy>
            </template>
          </div>
          <save-deck
            :deck="deck"
            :scope="scope"
            class="panel-block static"
          />
        </template>
      </div>

      <div class="field use">
        <div class="control">
          <button class="button is-fullwidth is-secondary" @click.prevent="done">
            Use this Deck
          </button>
        </div>
      </div>

      <div class="field close">
        <div class="control">
          <button class="button is-fullwidth is-secondary" @click.prevent="done">
            Close builder
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
import { mixins, Options, prop } from 'vue-class-component';
import { Tippy } from 'vue-tippy';
import { Imgable } from '../Imgable';
import { Scope, scopeMap } from './types';
import SaveDeck from './builder/SaveDeck.vue';
import DeckList from './builder/DeckList.vue';
import { Card } from '@/model/card';
import { CardProvider } from '@/services/CardProvider';


class Props {
  public baseDeck = prop<Array<Card>>({ required: false, default: [] });
  public scope = prop<Scope>({ required: true });
}

type Group = Scope | 'decks';

@Options({
  emits: ['done'],
  components: { DeckList, SaveDeck, Tippy },
})
export default class DeckBuilder extends mixins(Imgable).with(Props) {
  public selectedGroup: Group = this.scope;
  public cards: Array<Card>;
  public search = '';
  public deck: Array<Card> = [];

  public created() {
    this.cards = Container.get(CardProvider).getAllCards();
    this.deck = [...this.baseDeck];
  }

  public mounted() {
    if (this.baseDeck.length === 0) {
      this.all();
    }
  }

  public buildImgSrc(card: Card): string {
    return `/cards/${card.id}.jpg`;
  }

  public get filtered(): Array<Card> {
    if (this.selectedGroup === 'decks') {
      return [];
    }

    return this.cards
      .filter(c => c instanceof scopeMap[this.selectedGroup as Scope])
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
  @media screen and (max-height: 450px) and (orientation: landscape) {
    max-width: 100vw;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: var(--bg-color);
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr auto auto;
    row-gap: .5rem;
    grid-template-areas:
      "menu  builder"
      "close builder"
      "use   builder"
    ;

    h1.title { display: none };
  }

  max-width: 800px;
  max-height: 100vh;
  height: 100%;
  width: 100%;

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

.menu {
  @media screen and (max-height: 450px) and (orientation: landscape) {
    grid-area: menu;
    display: block;
  }

  display: none;

  background-color: var(--bg-color);

  .menu-list a {
    color: var(--text-color);
    border-radius: 0;

    &:hover, &.is-active {
      background-color: var(--secondary);
    }
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
  @media screen and (max-height: 450px) and (orientation: landscape) {
    grid-area: builder;
    border-radius: 0;
    border-top: none;
    border-bottom: none;
    border-right: none;
    margin: 0;
    box-shadow: none;
  }

  background-color: var(--bg-color);
  border: 1px solid var(--border-color);

  .panel-tabs:not(:last-child), .panel-block:not(:last-child) {
    border-bottom-color: var(--border-color);
  }

  .panel-tabs {
    @media screen and (max-height: 450px) and (orientation: landscape) {
      display: none;
    }

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
    @media screen and (max-height: 450px) and (orientation: landscape) {
      height: calc(100vh - 7em - 2px);
    }

    height: 60vh;
    overflow: scroll;
    border-bottom: 1px solid var(--border-color);
  }
}

img.card-preview {
  filter: drop-shadow(1px 1px 1px #585858);
  border-radius: var(--card-radius);
}

.field {
  margin: 0;
  padding: 0 .5rem;

  &.use {
    @media screen and (max-height: 450px) and (orientation: landscape) {
      grid-area: use;
      padding-bottom: .5rem;
    }
  }

  &.close {
    display: none;

    @media screen and (max-height: 450px) and (orientation: landscape) {
      display: block;
      grid-area: close;
    }
  }
}

.modal-close {
  @media screen and (max-height: 450px) and (orientation: landscape) {
    display: none;
  }
}
</style>
