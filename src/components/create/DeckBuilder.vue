<template>
  <div class="modal" style="display: block">
    <div class="modal-background"></div>
    <div class="modal-content">

      <h1 class="title">Build a Deck</h1>

      <!-- <aside class="menu">
        <ul class="menu-list">
          <li>
            <a
              v-if="scope === 'all'"
              @click="selectedGroup = 'all'"
              :class="{ 'is-active': selectedGroup === 'all' }"
            >All cards</a>
          </li>
          <li>
            <a
              @click="selectedGroup = 'planes'"
              :class="{ 'is-active': selectedGroup === 'planes' }"
            >Planes</a>
          </li>
          <li>
            <a
              v-if="scope === 'all'"
              @click="selectedGroup = 'phenomena'"
              :class="{ 'is-active': selectedGroup === 'phenomena' }"
            >Phenomenon</a>
          </li>
          <li>
            <a
              @click="selectedGroup = 'decks'"
              :class="{ 'is-active': selectedGroup === 'decks' }"
            >Decks</a>
          </li>
        </ul>
      </aside> -->

      <div class="panel">
        <p class="panel-tabs" >
          <a v-if="kind === 'all'" @click="group = 'all'" :class="{ 'is-active': group === 'all' }">All cards</a>
          <a @click="group = 'planes'" :class="{ 'is-active': group === 'planes' }">Planes</a>
          <a v-if="kind === 'all'" @click="group = 'phenomena'" :class="{ 'is-active': group === 'phenomena' }">Phenomenon</a>
        </p>

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
                <span>
                  <span class="tag is-light">{{ getType(card) }}</span>
                </span>
              </label>

              <template #content>
                <img loading="lazy" class="card-preview" :src="buildImgSrc(card)">
              </template>
            </tippy>
          </template>
        </div>
      </div>

      <div class="controls">
        <button
          @click.prevent="$emit('close')"
          class="button is-secondary"
        >
          Cancel
        </button>
        <save-btn
          @done="done"
          class="proceed is-primary"
          :state="deckState"
          v-model="action"
        ></save-btn>
      </div>
    </div>

    <button
      class="modal-close is-large"
      aria-label="cancel and close"
      @click.prevent="$emit('close')"
    ></button>
  </div>

  <name-modal
    v-if="nameModalOpen"
    @done="save"
    @cancel="nameModalOpen = false"
  ></name-modal>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-facing-decorator';
import { DeckKind, DeckReqs, DeckState, ProceedType, getDeckState } from './utils';
import SaveBtn from './SaveBtn.vue';
import NameModal from './NameModal.vue';
import { Imgable } from '#/components/Imgable';
import { Card, Phenomenon, Plane } from '#/model/card';
import { CardProvider } from '#/services/CardProvider';
import { MapType } from '#/model/map';
import { EternitiesMapDeckType } from '#/model/map/eternities';
import { useMain } from '#/store/main';


type Group = 'all' | 'planes' | 'phenomena';

const GROUP_MAP = {
  'all': Card,
  'planes': Plane,
  'phenomena': Phenomenon,
};

@Component({
  emits: ['close', 'use'],
  components: { NameModal, SaveBtn },
})
export default class DeckBuilder extends Imgable {
  @Prop({ required: true })
  public reqs: DeckReqs;

  private store = useMain();

  public nameModalOpen = false;

  public cards: Array<Card> = CardProvider.getAllCards();
  public group: Group = 'all';
  public search = '';
  public action: ProceedType = 'save_use';

  public deck: Array<Card> = [];

  public created() {
    this.group = this.kind;
  }

  public mounted() {
    this.all();
  }

  public get kind(): DeckKind {
    return (
      this.reqs.mapType === MapType.ETERNITIES &&
      this.reqs.deckType === EternitiesMapDeckType.PLANES
    )
      ? 'planes'
      : 'all';
  }

  public get filtered(): Array<Card> {
    return this.cards
      .filter(c => c instanceof GROUP_MAP[this.group])
      .filter(c => c.name.toLowerCase().includes(this.search));
  }

  public get deckState(): DeckState {
    return getDeckState(this.reqs.mapType, this.deck);
  }

  public getType(card: Card): string {
    return card instanceof Plane ? 'Plane' : 'Phenomenon';
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

  public save(deckName: string): void {
    this.nameModalOpen = false;
    this.store.addDeck(deckName, {
      list: this.deck.map(c => c.id),
      kind: this.deck.some(c => c instanceof Phenomenon) ? 'all' : 'planes',
      counts: this.deck.reduce((counts, card) => {
        counts.cards++;
        counts[card instanceof Plane ? 'planes' : 'phenomena']++;
        return counts;
      }, { cards: 0, planes: 0, phenomena: 0 }),
    });
    if (this.action === 'save_use') {
      return this.$emit('use', this.deck.map(c => c.id));
    }
    this.$emit('close');
  }

  public done(): void {
    if (this.action === 'use') {
      return this.$emit('use', this.deck.map(c => c.id));
    }
    this.nameModalOpen = true;
  }
}
</script>

<style lang="scss" scoped>
.modal {
  left: 0 !important;
  right: 0 !important;
}

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

    h1.title {
      display: none
    }
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

    &:hover,
    &.is-active {
      background-color: var(--secondary);
    }
  }
}

.button.all,
.button.none,
.button.save {
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

  .panel-tabs:not(:last-child),
  .panel-block:not(:last-child) {
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

    .panel-icon {
      flex-grow: 0;
    }

    span {
      flex: 1 1 0px;
      align-self: center;

      .tag {
        color: var(--secondary);
        background-color: var(--primary);
      }
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

.controls {
  display: flex;
  flex-direction: row;
  gap: 1rem;

  .proceed {
    flex-grow: 1;
  }
}

.modal-close {
  @media screen and (max-height: 450px) and (orientation: landscape) {
    display: none;
  }
}
</style>
