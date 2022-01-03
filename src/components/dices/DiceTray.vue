<template>
  <div class="dice-tray" :class="{ hidden: hidden }">
    <div class="trigger" @click="toggle">
      Dices
    </div>
    <div class="dices">
      <planar-dice />
      <dice :sides="6" />
      <dice :sides="20" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Dice from './Dice.vue';
import PlanarDice from './PlanarDice.vue';

@Options({ components: { Dice, PlanarDice } })
export default class DiceTray extends Vue {
  private hidden: boolean = true;

  public toggle(): void {
    this.hidden = !this.hidden;
  }
}
</script>

<style lang="scss" scoped>
@keyframes open {
  0% {
    transform: translateX(calc(21rem + 2px));
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes close {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(21rem + 2px));
  }
}

.dice-tray {
  z-index: 420;

  position: absolute;
  bottom: -7rem;
  right: -1rem;

  display: flex;
  flex-direction: row;

  height: 7rem;
  width: 23rem;

  animation: open .10s cubic-bezier(.55,.06,.68,.19) both;

  &.hidden {
    animation: close .10s cubic-bezier(.55,.06,.68,.19) both;
  }

  & > div {
    border: 1px solid var(--border-color);
    color: var(--text-color);
    background-color: var(--bg-color);
  }

  .dices {
    width: 100%;
    border-left: none;

    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    gap: .5rem;

    button {
      height: 5rem;
      width: 5rem;
      font-size: 2em;
    }
  }

  .trigger {
    box-sizing: content-box;

    writing-mode: vertical-rl;
    text-orientation: sideways;
    text-transform: uppercase;
    text-align: center;

    border-right: 1px solid var(--border-color);
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;

    width: 2rem;

    &:hover {
      border-color: #b5b5b5;
      cursor: pointer;
    }
  }
}
</style>
