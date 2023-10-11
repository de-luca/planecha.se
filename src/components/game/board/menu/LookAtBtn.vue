<template>
  <div
    :class="{ 'is-active': active }"
    class="dropdown is-left"
  >
    <tip>
      <template #btn>
        <div class="dropdown-trigger">
          <button
            @click="active = !active"
            @keyup.space.prevent
            :disabled="disabled"
            class="button is-ghost"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <fa icon="magnifying-glass" fixed-width size="lg" />
          </button>
        </div>
      </template>
      <template #tip>
        Look at the top cards<br>
        of your planar deck
      </template>
    </tip>

    <div class="click-trap" @click="active = false"></div>

    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <div class="dropdown-item">
          <div class="field">
            <label class="label">
              Look at the top
              <div class="counters tags has-addons">
                <span class="tag is-secondary minus" @click="decrease">
                  <fa icon="minus" fixed-width />
                </span>
                <span class="tag is-secondary value">
                  {{ cards }}
                </span>
                <span class="tag is-secondary plus" @click="cards++">
                  <fa icon="plus" fixed-width />
                </span>
              </div>
              cards of the planar deck.
            </label>
            <div class="field">
              <div class="control is-expanded">
                <button class="button is-small is-secondary is-fullwidth" @click="look">
                  Look
                </button>
              </div>
            </div>
            <p class="help">
              Useful with
              <l href="https://scryfall.com/card/who/110/susan-foreman">Susan Foreman</l>.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { useMain } from '#/store/main';

import { RevealerMode, RevealerSource, RevealerWallState, StateKey } from '#/model/wall';

@Component
export default class LookAtBtn extends Vue {
  @Prop({ required: true })
  public disabled: boolean;

  private store = useMain();
  public active = false;
  public cards = 2;

  public decrease() {
    this.cards = Math.max(this.cards - 1, 0);
  }

  public look() {
    this.store.privateReveal({ count: this.cards });
    const revealer: RevealerWallState = {
      title: `Look at the top ${this.cards} cards of your planar deck`,
      source: RevealerSource.CUSTOM,
      component: RevealerMode.SCRY,
      sendShownTo: 'bottom',
      initiator: '',
    };
    this.store.map.wallStates.set(StateKey.REVEALER, revealer);
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
    width: 16rem;

    .dropdown-item {
      color: var(--text-color);
      .counters {
        display: inline-flex;
      }
    }
  }
}
</style>
