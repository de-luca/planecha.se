<template>
  <div class="modal" style="display: block">
    <div class="modal-background"></div>
    <div class="modal-content">
      <h1 class="title">Build a Deck</h1>

      <div class="panel">
        <div class="panel-block static">
          <label @click="toggle">
            <input type="checkbox" :checked="!(!partial || !full)" :indeterminate="partial && !full">
          </label>
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
          <DropdownFilter v-model="selectedTypes" title="Types" :options="typeFilters" />
          <DropdownFilter v-model="selectedSets" title="Sets" :options="setFilters" />
        </div>
        <div class="card-list">
          <template v-for="card in filtered" :key="card.id">
            <tippy placement="bottom-end" duration="0" touch="false" hideOnClick="false">
              <label class="panel-block">
                <span class="panel-icon">
                  <input type="checkbox" :value="card" v-model="deck">
                </span>
                <span class="name">{{ card.name }}</span>
                <span class="type">
                  <span class="tag is-light">{{ card.type }}</span>
                </span>
                <span class="sets">
                  <tippy
                    v-for="set in card.sets"
                    v-bind:key="set"
                    appendTo="parent"
                    placement="left"
                    duration="0"
                    touch="false"
                    hideOnClick="false"
                  >
                    <component :is="sets.get(set)!.icon" />
                    <template #content>
                      <div class="tip">{{ sets.get(set)!.name }}</div>
                    </template>
                  </tippy>
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
import { DeckReqs, DeckState, ProceedType, getDeckState } from './utils';
import SaveBtn from './SaveBtn.vue';
import NameModal from './NameModal.vue';
import DropdownFilter, { Option } from './DropdownFilter.vue';

import { Imgable } from '#/components/Imgable';
import { Card, Phenomenon, Plane } from '#/model/card';
import { CardProvider } from '#/services/CardProvider';
import { MapType } from '#/model/map';
import { EternitiesMapDeckType } from '#/model/map/eternities';
import { useMain } from '#/store/main';

import { SetProvider } from '#/services/SetProvider';

@Component({
  emits: ['close', 'use'],
  components: { DropdownFilter, NameModal, SaveBtn },
})
export default class DeckBuilder extends Imgable {
  @Prop({ required: true })
  public reqs!: DeckReqs;

  private store = useMain();

  public readonly sets = SetProvider.getSets();
  public readonly setFilters = [...this.sets.values()].map((set) => ({
    label: set.name,
    value: set.code,
    icon: set.icon,
  }));
  public selectedSets = this.setFilters.map(s => s.value);

  public readonly typeFilters: Array<Option> = [];
  public selectedTypes: Array<string> = [];


  public nameModalOpen = false;

  public cards: Array<Card> = CardProvider.getAllCards();
  public search = '';
  public action: ProceedType = 'save_use';

  public deck: Array<Card> = [];

  public created() {
    this.typeFilters.push({ label: 'Plane' });
    if (
      this.reqs.mapType !== MapType.ETERNITIES ||
      this.reqs.deckType !== EternitiesMapDeckType.PLANES
    ) {
      this.typeFilters.push({ label: 'Phenomenon' });
    }
    this.selectedTypes = this.typeFilters.map(t => t.label);
  }

  public mounted() {
    this.toggle();
  }

  public get filtered(): Array<Card> {
    return this.cards
      .filter(c => this.selectedTypes.includes(c.type))
      .filter(c => this.selectedSets.some(set => c.sets.includes(set)))
      .filter(c => c.name.toLowerCase().includes(this.search));
  }

  public get deckState(): DeckState {
    return getDeckState(this.reqs.mapType, this.deck);
  }

  public get partial(): boolean {
    return this.filtered.some(c => this.deck.includes(c));
  }

  public get full(): boolean {
    return this.filtered.every(c => this.deck.includes(c));
  }

  public toggle(): void {
    this.deck = this.full
      ? this.deck.filter(c => this.filtered.findIndex(fc => fc.id === c.id) === -1)
      : [...new Set([...this.filtered, ...this.deck])];
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

  .panel-block:not(:last-child) {
    border-bottom-color: var(--border-color);
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

    .name {
      flex-grow: 2;
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

    .sets {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      gap: .5rem;
      padding-right: .5rem;

      .tip {
        border: 1px solid var(--border-color);
        padding: .5rem 1rem;
        background-color: var(--bg-color);
        border-radius: 6px;
        width: max-content;
      }

      span {
        flex: unset;
      }

      svg {
        fill: var(--brand-color-primary);
        height: 1.2rem;
        vertical-align: middle;
        &:hover {
          fill: var(--brand-color-secondary);
        }
      }
    }
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
