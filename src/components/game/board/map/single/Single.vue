<template>
  <div class="active" :class="{ buncha: active.length > 1 }">
    <card v-for="a in active" :key="a.id" :card="a" :hidden="!hasStarted" class="card" />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-facing-decorator';
import { Map } from '../Map';
import { Card as ModelCard } from '#/model/card';

import Card from '#/components/controls/Card.vue';

@Component({
  components: { Card },
})
export default class Single extends Map {
  public get active(): Array<ModelCard> {
    return this.store.map.active;
  }

  public planeswalk(): void {
    this.store.planeswalk({});
  }
}
</script>

<style lang="scss" scoped>
.card {
  background: none;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    z-index: 2;
  }
  &:not(:hover) {
    z-index: 1;
  }
}

.active {
  grid-area: active;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  &.buncha {
    height: auto;
    padding-top: 2rem;
    padding-bottom: 2rem;
    gap: 2.5rem
  }
}
</style>
