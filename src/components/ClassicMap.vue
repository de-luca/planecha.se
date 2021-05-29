<template>
  <div class="map">
    <div class="active">
      <template v-for="a in active" :key="a.id">
        <card :card="a" />
      </template>
    </div>

    <div class="deck">
      <deck :count="deckSize" />
    </div>

    <div class="logs">
      <logs />
    </div>

    <div class="controls">
      <chaos-btn />
      <planeswalk-btn />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Card from '@/components/board/Card.vue';
import Deck from '@/components/board/Deck.vue';
import ChaosBtn from '@/components/board/ChaosBtn.vue';
import PlaneswalkBtn from '@/components/board/PlaneswalkBtn.vue';
import Logs from '@/components/board/Logs.vue';
import { Store, useStore } from '@/store';
import { Card as ModelCard } from '@/model/card';

@Options({
  components: { Card, Deck, ChaosBtn, PlaneswalkBtn, Logs },
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
}
</script>

<style lang="scss" scoped>
.map {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 11rem auto auto;
  column-gap: 3rem;
  row-gap: .5rem;
  grid-template-areas:
    "active active deck    "
    "active active controls"
    "active active logs     "
    "active active logs     "
  ;
}

.active {
  grid-area: active;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.deck {
  grid-area: deck;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.controls {
  grid-area: controls;

  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  gap: .5rem;

  & > button {
    height: 10rem;
    width: 10rem;
  }
}

.logs {
  grid-area: logs;
  overflow: scroll;
}
</style>
