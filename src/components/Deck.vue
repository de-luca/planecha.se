<template>
  <div class="deck-container">
    <img src="/cards/back.png">
    <div class="count">{{ count }}</div>
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
}
.count {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;

  color: #000;
  font-weight: bolder;
  font-size: 5rem;
  text-shadow: 1px 1px white;
}
</style>
