<template>
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
          <button @click.prevent="clearSearch" class="delete"></button>
        </span>
      </p>
    </div>
    <template v-for="card in filtered" :key="card.id">
      <label class="panel-block">
        <span class="panel-icon">
          <input type="checkbox" :value="card.id" v-model="selected">
        </span>
        <span>{{ card.name }}</span>
      </label>
    </template>
  </nav>
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
  public modelValue = prop<Array<Card>>({ required: true });
  public group = prop<Group>({ required: true });
}

@Options({
  emits: ['update:modelValue'],
})
export default class CardPicker extends Vue.with(Props) {
  private deckProvider: DeckProvider;
  private cards: Array<Card>;
  private search: string = '';
  private selectedGroup: Group = this.group;

  public created() {
    this.deckProvider = Container.get(DeckProvider);
    this.cards = this.deckProvider.getAllCards();
  }

  public mounted() {
    this.all();
  }

  public set selected(value: Array<string>) {
    this.$emit('update:modelValue', this.deckProvider.getOrderedPile(value));
  }

  public get selected(): Array<string> {
    return this.modelValue.map(c => c.id);
  }

  public get filtered(): Array<Card> {
    return this.cards
      .filter(c => this.selectedGroup === Group.ALL || c.type === this.selectedGroup)
      .filter(c => c.name.toLowerCase().includes(this.search));
  }

  public clearSearch(): void {
    this.search = '';
  }

  public all(): void {
    this.selected = [...new Set([
      ...this.filtered.map(c => c.id),
      ...this.selected,
    ])];
  }

  public none(): void {
    const tmpSelected = new Set(this.selected);
    this.filtered.forEach(c => tmpSelected.delete(c.id));
    this.selected = [...tmpSelected];
  }
}
</script>

<style lang="scss" scoped>
.panel-tabs {
  font-size: 1em;
}
.panel-block {
  gap: 5px;
}
</style>
