<template>
  <div class="wrapper">
    <div class="active" v-for="(a, i) in actives" :key="i">
      <card v-if="a.active.length === 1" :card="a.active[0]" :hidden="!hasStarted" />
      <div v-else @click="shown = a">
        <fa icon="ellipsis" size="10x" />
      </div>
      <h1>{{ a.mate }}</h1>
    </div>
  </div>

  <modal v-if="shown" :scroll="true" @close="shown = null">
    <div class="details">
      <h1 class="title">{{ shown.yours ? 'Your board' : shown.mate + '\'s board' }}</h1>
      <card v-for="card in shown.active" :key="card.id" :card="card" :ro="!shown.yours" />
    </div>
  </modal>
</template>

<script lang="ts">
import { Component } from 'vue-facing-decorator';
import { Map } from '../Map';
import { Card as ModelCard } from '#/model/card';
import { Multi as MultiMap } from '#/model/map/multi/Multi';

import Card from '#/components/controls/Card.vue';

interface Active {
  yours: boolean;
  mate: string;
  active: Array<ModelCard>;
}

@Component({
  components: { Card },
})
export default class Multi extends Map {
  public shown: Active | null = null;

  public get actives(): Array<Active> {
    return [{
      yours: true,
      mate: this.store.getMateName(),
      active: this.store.map.active,
    }].concat(
      [...(this.store.map as MultiMap).mateStates.entries()]
        .map(([peer, map]) => ({
          yours: false,
          mate: this.store.getMateName(peer),
          active: map.active,
        })),
    );
  }

  public planeswalk(): void {
    this.store.planeswalk({});
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  grid-auto-flow: dense;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: calc((100vh - 3rem) / 2);
  gap: 1rem;

  height: 100%;
  padding: 1rem 0;


  .active {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: .5rem;
    padding: 1rem 0;

    div:first-of-type {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: calc((100vh - 3rem) / 2 - 5rem);
    }
  }
}

.details {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  padding: 2.5rem 1rem;
}
</style>
