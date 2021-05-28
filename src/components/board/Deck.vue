<template>
  <div class="deck-container">
    <img src="/cards/back.png">
    <div class="count">
      <strong>{{ count }}</strong> cards remaining
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

class Props {
  public count = prop<number>({ required: true });
}

export default class Deck extends Vue.with(Props) {}
</script>

<style lang="scss" scoped>
.deck-container {
  position: relative;

  img {
    height: 15rem;
  }
}
.count {
  text-align: center;
  font-size: 1.5rem;
}
</style>
