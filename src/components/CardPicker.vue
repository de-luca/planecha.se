<template>
  <nav class="panel">
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
    <p class="panel-tabs">
      <a @click="setGroup('all')" :class="{'is-active': group === 'all'}">All</a>
      <a @click="setGroup('plane')" :class="{'is-active': group === 'plane'}">Planes</a>
      <a @click="setGroup('phenomenon')" :class="{'is-active': group === 'phenomenon'}">Phenomenon</a>
    </p>
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
import Container from 'typedi';
import { Options, prop, Vue } from "vue-class-component";
import { DeckProvider } from '@/services/DeckProvider';
import { Card } from '@/model/card';

enum Group {
  ALL = 'all',
  PLANES = 'plane',
  PHENOMENA = 'phenomenon',
}

class Props {
  public modelValue = prop<Set<string>>({ required: true });
}

@Options({
  emits: ['update:modelValue'],
})
export default class CardPicker extends Vue.with(Props) {
  private cards: Array<Card>;
  private search: string = '';
  private group: Group = Group.ALL;

  public created() {
    this.cards = Container.get(DeckProvider).getAllCards();
  }

  public mounted() {
    this.all();
  }

  public set selected(value: Set<string>) {
    this.$emit('update:modelValue', value);
  }

  public get selected(): Set<string> {    
    return this.modelValue;
  }

  public get filtered(): Array<Card> {
    return this.cards
      .filter(c => this.group === Group.ALL || c.type === this.group)
      .filter(c => c.name.toLowerCase().includes(this.search));
  }

  public setGroup(group: Group): void {
    this.group = group;
  }

  public clearSearch(): void {
    this.search = '';
  }

  public all(): void {
    this.selected = new Set([
      ...this.filtered.map(c => c.id),
      ...this.selected,
    ]);
  }

  public none(): void {
    this.filtered
      .map(c => c.id)
      .forEach((id) => this.selected.delete(id));
  }
}
</script>

<style lang="scss" scoped>
.panel-block {
  gap: 5px;
}
</style>
