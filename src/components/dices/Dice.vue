<template>
  <button
    class="button is-secondary is-rounded"
    :title="'Roll a d' + sides"
    @click="roll"
    @keyup.space.prevent
  >
    <fa v-if="!rolled" :icon="icon" />
    <span v-else>{{ rolled }}</span>
  </button>
</template>

<script lang="ts">
import { prop, Vue } from 'vue-class-component';

class Props {
  public sides = prop<number>({ required: true });
}

export default class Dice extends Vue.with(Props) {
  private rolled: number | null = null;
  private timeoutId: number | null = null;

  public get icon(): string {
    return this.sides === 6 ? 'dice-d6' : 'dice-d20';
  }

  public roll(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.rolled = Math.floor(Math.random() * this.sides) + 1;
    this.timeoutId = window.setTimeout(() => this.rolled = null, 2000);
  }
}
</script>
