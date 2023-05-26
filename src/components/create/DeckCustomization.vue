<template>
  <div class="modal" style="display: block">
    <div class="modal-background"></div>
    <div class="modal-content">

      <h1 class="title">Deck Customization</h1>

      <div class="panel">
        <p class="panel-tabs">
          <a
            @click="tab = 'customs'"
            :class="{'is-active': tab === 'customs'}"
          >
            Your Decks
          </a>
          <a
            v-if="reqs.mapType !== 'eternities'"
            @click="tab = 'presets'"
            :class="{'is-active': tab === 'presets'}"
          >
            Preconstructed Decks
          </a>
        </p>

        <keep-alive v-if="tab === 'customs'">
          <custom-list
            @use="use"
            @builder="builder = true"
            @presets="tab = 'presets'"
            :reqs="reqs"
          ></custom-list>
        </keep-alive>
        <keep-alive v-else>
          <preset-list @use="use"></preset-list>
        </keep-alive>
      </div>
    </div>

    <button
      class="modal-close is-large"
      aria-label="cancel and close"
      @click.prevent="$emit('cancel')"
    ></button>

    <deck-builder
      v-if="builder"
      @use="use"
      @close="builder = false"
      :reqs="reqs"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-facing-decorator';
import CustomList from './CustomList.vue';
import PresetList from './PresetList.vue';
import DeckBuilder from './DeckBuilder.vue';
import { DeckReqs } from './utils';
import { Imgable } from '#/components/Imgable';
import { CardProvider } from '#/services/CardProvider';

@Component({
  emits: ['cancel', 'use'],
  components: { DeckBuilder, CustomList, PresetList },
})
export default class DeckCustomization extends Imgable {
  @Prop({ required: true })
  public reqs: DeckReqs;

  public builder = false;
  public tab: 'customs' | 'presets' = 'customs';

  public use(cards: Array<string>): void {
    this.$emit('use', CardProvider.getCardList(cards));
  }
}
</script>

<style lang="scss" scoped>
.modal-content {
  @media screen and (max-height: 450px) and (orientation: landscape) {
    max-width: 100vw;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: var(--bg-color);
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr auto auto;
    row-gap: .5rem;
    grid-template-areas:
      "menu  builder"
      "close builder"
      "use   builder"
    ;

    h1.title {
      display: none
    }
  }

  max-width: 800px;
  max-height: 100vh;
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: .5rem;
  margin: 0 auto;

  h1.title {
    text-align: center;
    color: whitesmoke;
  }
}

.menu {
  @media screen and (max-height: 450px) and (orientation: landscape) {
    grid-area: menu;
    display: block;
  }

  display: none;

  background-color: var(--bg-color);

  .menu-list a {
    color: var(--text-color);
    border-radius: 0;

    &:hover,
    &.is-active {
      background-color: var(--secondary);
    }
  }
}

.button.all,
.button.none,
.button.save {
  color: var(--text-color);
  background-color: var(--bg-color);
  border-color: var(--border-color);

  &:hover {
    border-color: #b5b5b5;
  }

  &:focus {
    border-color: #485fc7;
    box-shadow: 0 0 0 .125em rgba(72, 95, 199, .25);
  }
}

.panel {
  @media screen and (max-height: 450px) and (orientation: landscape) {
    grid-area: builder;
    border-radius: 0;
    border-top: none;
    border-bottom: none;
    border-right: none;
    margin: 0;
    box-shadow: none;
  }

  background-color: var(--bg-color);
  border: 1px solid var(--border-color);

  .panel-tabs:not(:last-child),
  .panel-block:not(:last-child) {
    border-bottom-color: var(--border-color);
  }

  .panel-tabs {
    @media screen and (max-height: 450px) and (orientation: landscape) {
      display: none;
    }

    font-size: 1em;
    padding-left: 1rem;
    padding-right: 1rem;

    a {
      border-bottom-color: var(--border-color);

      &.is-active {
        color: var(--text-color);
        border-bottom-color: var(--primary);
      }
    }

    span {
      flex-grow: 1;
    }
  }

  .panel-block {
    color: var(--text-color);
    gap: 5px;

    &.static:hover {
      background-color: unset;
    }

    &:last-child {
      border-radius: unset;
    }

    &:hover {
      background-color: var(--secondary);
    }

    input {
      border-color: var(--border-color);
    }
  }

  .card-list {
    @media screen and (max-height: 450px) and (orientation: landscape) {
      height: calc(100vh - 7em - 2px);
    }

    height: 60vh;
    overflow: scroll;
    border-bottom: 1px solid var(--border-color);
  }
}

.modal-close {
  @media screen and (max-height: 450px) and (orientation: landscape) {
    display: none;
  }
}
</style>
