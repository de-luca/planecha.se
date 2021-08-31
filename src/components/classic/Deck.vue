<template>
  <div class="deck-container">
    <img src="/cards/back.jpg">
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
    border-radius: 3.5% / 4.7%;
  }
}
.count {
  text-align: center;
  font-size: 1.5rem;
}
</style>
