<template>
  <div class="current">
    <template v-for="a in active" :key="a.id">
      <Card :card="a" />
    </template>
  </div>

  <div class="deck">
    <Deck :count="deckSize" />
  </div>

  <!-- <div class="played">
    <template v-for="p in played.slice().reverse()" :key="p.id">
      <p>{{ p.name }}</p>
    </template>
  </div> -->

  <div class="controls">
    <Controls />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Card from '@/components/board/Card.vue';
import Controls from '@/components/board/Controls.vue';
import Deck from '@/components/board/Deck.vue';
import { MutationTypes, Store, useStore } from '@/store';
import { Card as ModelCard } from '@/model/card';

@Options({
  components: { Card, Controls, Deck },
})
export default class ClassicMap extends Vue {
  public store: Store;

  public created() {
    this.store = useStore();
  }

  public get active(): Array<ModelCard> {
    return this.store.getters.active;
  }
  
  public get played(): Array<ModelCard> {
    return this.store.getters.played;
  }
  
  public get deckSize(): number {
    return this.store.getters.deckSize;
  }

  public planeswalk() {
    this.store.commit(MutationTypes.PLANESWALK);
  }
}
</script>

<style lang="scss" scoped>
</style>
