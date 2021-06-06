<template>
  <div class="map">
    <div class="active">
      <template v-for="a in active" :key="a.id">
        <card :card="a" />
      </template>
    </div>

    <div class="logs">
      <logs />
    </div>

    <div class="controls">
      <chaos-btn />
      <planeswalk-btn />
    </div>

    <reveal-drawer
      v-if="revealed"
      :revealed="revealed"
      @done="resolve" 
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Card from '@/components/board/Card.vue';
import Deck from '@/components/board/Deck.vue';
import ChaosBtn from '@/components/board/ChaosBtn.vue';
import PlaneswalkBtn from '@/components/board/PlaneswalkBtn.vue';
import Logs from '@/components/board/Logs.vue';
import RevealDrawer, { PickedLeft } from '@/components/board/RevealDrawer.vue';
import { MutationTypes, Store, useStore } from '@/store';
import { Card as ModelCard } from '@/model/card';
import { eventBus } from '@/services/EventBus';
import { CardEvent } from '@/model/card/CardEvent';
import { Revealed } from '@/model/map/MapInterface';

@Options({
  components: { Card, Deck, ChaosBtn, PlaneswalkBtn, Logs, RevealDrawer },
})
export default class ClassicMap extends Vue {
  private store: Store;

  public created() {
    this.store = useStore();

    eventBus.on(CardEvent.ARETOPOLIS, () => console.log('10 counters, planeswalk'));
    eventBus.on(CardEvent.STAIRS_TO_INFINITY, () => {
      this.store.commit(MutationTypes.REVEAL, { count: 1 });
    });
  }

  public get active(): Array<ModelCard> {
    return this.store.getters.active;
  }
  
  public get played(): Array<ModelCard> {
    return this.store.getters.played;
  }

  public get revealed(): Revealed | undefined {
    return this.store.getters.revealed;
  }
  
  public get deckSize(): number {
    return this.store.getters.deckSize;
  }
  
  public resolve(choices: PickedLeft): void {
    this.store.commit(MutationTypes.RESOLVE_REVEAL, {
      top: choices.picked,
      bottom: choices.left,
    });
  }
}
</script>

<style lang="scss" scoped>
.map {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 11rem auto 40rem;
  column-gap: 3rem;
  row-gap: .5rem;
  grid-template-areas:
    "active active controls "
    "active active .        "
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
