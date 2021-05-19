<template>
  <div class="board">
    <div class="test">
      <div>Logo</div>

      <div>
        <button class="button is-ghost">Back</button>
        <button class="button is-ghost">Open</button>
        <button class="button is-ghost is-loading">Useless</button>
      </div>

      <button class="button is-ghost">Useless</button>
    </div>

    <div class="sub-container">

      <div class="current">
        <template v-for="a in active" :key="a.id">
          <Card :card="a" />
        </template>
      </div>

      <div class="deck">
        <Deck :count="deckSize" />
      </div>

      <div class="played">
        <template v-for="p in played.slice().reverse()" :key="p.id">
          <p>{{ p.name }}</p>
        </template>
      </div>

      <div class="controls">
        <div class="action">
          <button class="button is-ghost">
            <svg class="chaos" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 100'><path d='M76.142 0c-36.768 1.68 4.253 32.994-16.484 49.5l-.005.004-.007-.01-.293.129c-14.524 5.879-30.695-17.715-31.166 7.076 7.67-11.506 11.167-.273 23.775-.977-6.123 8.09-3.121 21.664-13.33 23.873-18.65 4.033-32.297-18.639-31.16-32.869 2.525-31.602 27.29-45.969 51.881-44.488-32.55-6.518-60.143 20.309-59.335 48.137.928 31.91 17.857 47.527 43.841 49.625 36.768-1.678-4.253-32.996 16.484-49.5l.005-.004.007.01.294-.129c14.523-5.879 30.696 17.715 31.165-7.076-7.669 11.506-11.167.273-23.775.977 6.123-8.09 3.123-21.664 13.331-23.871 18.651-4.033 32.296 18.637 31.159 32.867-2.523 31.604-27.289 45.969-51.88 44.488 32.55 6.518 60.143-20.309 59.334-48.139-.927-31.908-17.858-47.523-43.841-49.623z' fill='#000'/></svg>
          </button>
          <button class="button is-ghost" @click="click">
            <svg class="planeswalk" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 54 100'><path d='M0 50.247l.156-1.969h-.061l.061-.032 2.059-26.239s1.026 18.147 4.085 23.392c1.313-.519 2.647-.984 4.002-1.403 3.306-8.657 4.467-34.379 4.467-34.379s.772 23.434 3.681 32.529c1.595-.239 3.218-.407 4.872-.51 3.007-11.188 3.824-41.636 3.824-41.636s.991 30.521 3.953 41.673c1.576.114 3.127.292 4.653.528 2.873-9.06 4.024-32.597 4.024-32.597s.931 25.864 3.941 34.449c1.319.409 2.617.871 3.89 1.376 3.338-5.179 4.513-23.388 4.513-23.388l1.592 26.224.067.034h-.063l.118 1.947s-26.689 8.691-26.689 49.485c0-40.601-27.146-49.485-27.146-49.485' fill='#000'/></svg>
          </button>
        </div>
      </div>

    </div>

  </div>
  <!-- <div>
    BOARD
    <Map />
  </div> -->
  <!-- <Deck /> -->
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Card as ModelCard } from '@/model/card';
import { Store, useStore, MutationTypes } from '@/store';
import Card from '@/components/Card.vue';
import Deck from '@/components/Deck.vue';

@Options({
  components: { Card, Deck },
})
export default class Board extends Vue {
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

  public click() {
    this.store.commit(MutationTypes.PLANESWALK);
  }
}
</script>

<style lang="scss" scoped>
.board {
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: 8rem auto;
  gap: 25px;
}

.test {
  height: 100%;
  background-color: lightgray;
  border-right: 1px solid grey;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding-left: 5px;
  padding-right: 5px;

  text-align: center;

}


.sub-container {
  width: 1200px;
  padding-top: 2rem;

  display: grid;
  grid-template-columns: 70% auto;
  gap: 10px;
  grid-template-areas:
    "current deck"
    "current played"
    "current controls"
  ;
}

.current {
  grid-area: current;
}

.deck {
  grid-area: deck;
}

.played {
  grid-area: played;
}

.controls {
  grid-area: controls;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .action {
    display: inline-flex;
    gap: .5rem;
    padding-bottom: 7px;

    button {
      flex: 1 1 0px;
      height: 6rem;

      &:hover {
        svg path {
          filter: drop-shadow(0px 0px 1px #222);
        }
      }

      svg path {
        fill: gray;
      }
      
      .chaos {
        height: 3.5rem;
      }
      .planeswalk {
        height: 6rem;
      }
    }
  }
}
</style>
