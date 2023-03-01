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
import { Component, Prop } from 'vue-facing-decorator';
import { BaseDice } from './BaseDice';

@Component
export default class Dice extends BaseDice<DiceResult> {
  @Prop({ required: true })
  public sides: number;

  public getResult(): DiceResult {
    return this.store.rollDice(this.sides);
  }
}
</script>
