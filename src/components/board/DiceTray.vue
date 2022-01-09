<template>
  <div
    :class="{ 'is-active': active }"
    class="dropdown is-right"
  >
    <div class="dropdown-trigger">
      <button
        @click="active = !active"
        @keyup.space.prevent
        class="button is-outlined"
        aria-haspopup="true"
        aria-controls="dropdown-menu"
      >
        <span class="icon is-medium">
          <fa icon="dice-d20" fixed-width />
        </span>
      </button>
    </div>

    <div class="click-trap" @click="active = false"></div>

    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <div class="dropdown-item dices">
          <planar-dice />
          <dice :sides="6" />
          <dice :sides="20" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Dice from '../dices/Dice.vue';
import PlanarDice from '../dices/PlanarDice.vue';


@Options({ components: { Dice, PlanarDice } })
export default class DiceTray extends Vue {
  private active: boolean = false;
}
</script>

<style lang="scss" scoped>
.click-trap {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: transparent;
  z-index: 3;
}

.dropdown.is-active .click-trap {
  display: block;
}

.dropdown-menu {
  .dropdown-content {
    color: var(--text-color);
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);

    .dropdown-item {
      color: var(--text-color);

      &.dices {
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
    }
  }
}
</style>
