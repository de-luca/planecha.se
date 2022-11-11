<template>
  <button
    class="button is-secondary is-rounded"
    :class="{ 'is-loading': rolling }"
    :title="'Roll a d' + sides"
    @click="roll"
    @keyup.space.prevent
  >
    <slot v-if="showFace"></slot>
    <span v-else>{{ rolled }}</span>
  </button>
</template>

<script lang="ts">
import { mixins, prop } from 'vue-class-component';
import { BaseDice } from './BaseDice';

class Props {
  public sides = prop<number>({ required: true });
}

export default class Dice extends mixins(BaseDice<DiceResult>).with(Props) {
  public getResult(): DiceResult {
    return this.store.rollDice(this.sides);
  }
}
</script>
