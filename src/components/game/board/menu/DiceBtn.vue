<template>
  <div
    :class="{ 'is-active': active }"
    class="dropdown is-left"
  >
    <Tip>
      <template #btn>
      <div class="dropdown-trigger">
          <button
            @click="active = !active"
            @keyup.space.prevent
            class="button is-ghost"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <fa icon="dice-d20" fixed-width size="lg" />
          </button>
        </div>
        </template>
        <template #tip>Roll dices</template>
    </Tip>

    <div class="click-trap" @click="active = false"></div>

    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
          <a class="dropdown-item" @click="open('planar')" @mouseover="hover = true" @mouseleave="hover = false">
            <Chaos v-if="hover" class="icn is-primary dice chaos"/>
            <Planeswalk v-else class="icn is-primary dice" />
            <span>Roll the Planar Dice</span>
          </a>
          <a class="dropdown-item" @click="open('coin')">
            <Coin class="icn is-primary dice" />
            <span>Flip a coin</span>
          </a>

          <a v-for="[t, c] in dices" class="dropdown-item" @click="open(t)">
            <component :is="c" class="icn is-primary dice" />
            <span>Roll a {{ t.toLowerCase() }}</span>
          </a>
        </div>
    </div>
  </div>
  <DiceModal v-if="modal" :type="modal" @close="modal = null" />
</template>

<script lang="ts">
import { Component as VueComponent, markRaw } from 'vue';
import { Component, Vue } from 'vue-facing-decorator';
import { DiceType } from './dices';

import Tip from './Tip.vue';
import DiceModal from './modals/DiceModal.vue';
import * as SVGs from '#/components/svgs';

@Component({ components: { ...SVGs, Tip, DiceModal } })
export default class DiceMenu extends Vue {
  public dices: Array<[DiceType, VueComponent]> = [
    ['d4', markRaw(SVGs.D4)],
    ['d6', markRaw(SVGs.D6)],
    ['d8', markRaw(SVGs.D8)],
    ['d10', markRaw(SVGs.D10)],
    ['d12', markRaw(SVGs.D12)],
    ['d20', markRaw(SVGs.D20)],
  ];

  public active = false;
  public hover = false;
  public modal: DiceType | null = null;

  public open(type: DiceType): void {
    this.modal = type;
    this.active = false;
  }
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
  top: -100%;
  left: 5rem;

  .dropdown-content {
    color: var(--text-color);
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);

    .dropdown-item {
      color: var(--text-color);
      display: flex;
      flex-direction: row;
      align-items: center;

      gap: .5rem;

      &:hover {
        background-color: var(--secondary);
      }

      .dice {
        height: 1em;
        width: 1.5rem;

        &.chaos {
          height: .8em;
        }
      }
    }
  }
}
</style>
