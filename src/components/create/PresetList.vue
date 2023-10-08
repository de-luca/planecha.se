<template>
  <div class="panel-block static">
    <p class="control has-icons-right">
      <input
        @keypress.enter.prevent
        class="input"
        type="text"
        placeholder="Search for a deck"
        v-model="search"
      >
      <span class="icon is-right">
        <button @click.prevent="search = ''" class="delete"></button>
      </span>
    </p>
  </div>
  <div class="deck-list">
    <template v-for="deck in decks" :key="deck.name">
      <div
        class="panel-block"
        :class="{ opened: opened === deck.name }"
        @click.prevent="toggleDetails(deck.name)"
      >
        <div class="top">
          <span class="name">
            <strong>{{ deck.name }}</strong>
            <span>
              <abbr v-for="pip in deck.identity" :key="pip" class="pip" :class="pip">pip</abbr>
            </span>
          </span>
          <span>{{ deck.cards.length }} cards</span>
          <button
            class="button is-small"
            @click.prevent.stop="$emit('use', deck.cards)"
          >Use</button>
        </div>
        <div class="bottom">
          <span>{{ deck.face?.join(' / ') }}</span>
          <small>{{ deck.set.name }} <em>{{ deck.set.code }}</em> ({{ deck.set.year }})</small>
        </div>
      </div>
      <card-list v-if="opened === deck.name" :list="deck.cards"></card-list>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import CardList from './CardList.vue';
import { PresetDeck, PresetProvider } from '#/services/PresetProvider';

@Component({
  emits: ['use'],
  components: { CardList },
})
export default class PresetList extends Vue {
  public search = '';
  public opened = '';

  public get decks(): Array<PresetDeck> {
    return PresetProvider
      .getDecks()
      .filter(({ name }) => name.toLowerCase().includes(this.search));
  }

  public toggleDetails(name: string): void {
    this.opened = this.opened === name ? '' : name;
  }
}
</script>

<style lang="scss" scoped>
.panel-tabs:not(:last-child), .panel-block:not(:last-child) {
  border-bottom-color: var(--border-color);
}

.panel-block {
  color: var(--text-color);
  gap: 5px;

  display: block;

  &.disabled {
    opacity: 20%;
  }

  &.static:hover {
    background-color: unset;
  }

  &:last-child {
    border-radius: unset;
  }

  &:hover, &.opened {
    background-color: var(--secondary);
  }

  input {
    border-color: var(--border-color);
  }

  button.button {
    color: var(--text-color);
    background-color: var(--bg-color);
    border-color: var(--border-color);
    width: 4rem;

    &:hover {
      border-color: #b5b5b5;
    }

    &.del {
      color: var(--btn-danger-color);
      background-color: var(--btn-danger-bg);
      border-color: var(--btn-danger-border);

      &:hover {
        color: var(--btn-danger-color);
        background-color: var(--btn-danger-hover-bg);
      }

      &:active {
        color: var(--btn-danger-color);
        background-color: var(--btn-danger-active-bg);
      }
    }
  }

  div.top {
    display: flex;

    span {
      flex: 1 1 0px;
      align-self: center;

      &.name {
        display: flex;
        gap: .5rem;
      }

      strong {
        color: var(--text-color);
      }
    }
  }
  div.bottom {
    display: flex;
    flex-direction: column;
  }
}

.deck-list {
  height: calc(60vh + 3.5em);
  overflow: scroll;
  border-bottom: 1px solid var(--border-color);
}
</style>
