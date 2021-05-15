<template>
  <div class="container">
    <h1 class="title">BOARD FUCK YEAH</h1>
    <template v-for="a in active" :key="a.id">
      <p>{{ a.name }}</p>
    </template>

    <template v-for="p in played" :key="p.id">
      <p>{{ p.name }}</p>
    </template>

    <p>Remaining: {{ deckSize }}</p>

    <div class="control">
      <button @click="click" class="button is-dark">Planeswalk</button>
    </div>
  </div>
  <!-- <div>
    BOARD
    <Map />
  </div> -->
  <!-- <Deck /> -->
</template>

<script lang="ts">
import { Card } from '@/model/card';
import { Store, useStore } from '@/store';
import { MutationTypes } from '@/store/modules/map';
import { Vue } from 'vue-class-component';

export default class Board extends Vue {
  public store: Store;

  public created() {
    this.store = useStore();
  }

  public get active(): Array<Card> {
    return this.store.getters.active;
  }
  
  public get played(): Array<Card> {
    return this.store.getters.played;
  }
  
  public get deckSize(): number {
    return this.store.getters.deckSize;
  }

  public click() {
    this.store.commit(MutationTypes.PLANESWALK);
  }
}
</script>
