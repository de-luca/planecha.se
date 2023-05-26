<template>
  <template v-if="decks.size > 0">
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
      <button class="button" @click.prevent="$emit('builder')">New Deck</button>
    </div>
    <div class="deck-list">
      <template v-for="[name, deck] in decks" :key="name">
        <div
          class="panel-block"
          :class="{ opened: opened === name }"
          @click.prevent="toggleDetails(name)"
        >
          <span><strong>{{ name }}</strong></span>
          <span>{{ deck.list.length }} cards</span>
          <span>
            <span class="tag is-light">{{ getTag(deck.kind) }}</span>
          </span>

          <button
            @click.prevent.stop="remove(name)"
            class="button is-small del"
          >
            Delete
          </button>
          <button
            @click.prevent.stop="$emit('use', deck.list)"
            class="button is-small"
            :disabled="!canUse(deck)"
          >
            Use
          </button>
        </div>
        <card-list v-if="opened === name" :list="deck.list"></card-list>
      </template>
    </div>
  </template>
  <div v-else class="empty">
    <div class="subtitle">You don't have any custom decks.</div>
    <div class="actions">
      <button class="button" @click.prevent="$emit('builder')">Create a new Deck</button>
      <button
        v-if="reqs.mapType !== 'eternities'"
        class="button is-ghost"
        @click.prevent="$emit('presets')"
      >
        Use a Preconstructed Deck
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { DeckKind, DeckReqs, REQUIREMENTS, SavedDeck, CardType } from './utils';
import CardList from './CardList.vue';
import { useMain } from '#/store/main';
import { MapType } from '#/model/map';
import { EternitiesMapDeckType } from '#/model/map/eternities';

const KIND_MAP = {
  'all': 'Planes and Phenomena',
  'planes': 'Only Planes',
};

@Component({
  emits: ['use', 'builder', 'presets'],
  components: { CardList },
 })
export default class CustomList extends Vue {
  @Prop({ required: true })
  public reqs: DeckReqs;

  private store = useMain();

  public search = '';
  public opened = '';

  public get decks(): Map<string, SavedDeck> {
    return new Map(
      [...this.store.decks]
        .filter(([k]) => k.toLowerCase().includes(this.search)),
    );
  }

  public get kind(): DeckKind {
    return (
      this.reqs.mapType === MapType.ETERNITIES &&
      this.reqs.deckType === EternitiesMapDeckType.PLANES
    )
      ? 'planes'
      : 'all';
  }

  public canUse(deck: SavedDeck): boolean {
    if (this.kind !== 'all' && deck.kind !== this.kind) {
      return false;
    }

    const req = REQUIREMENTS[this.reqs.mapType];
    return Object.entries(req).every(([k, r]) => {
      return deck.counts[k as CardType] >= r.min
        && deck.counts[k as CardType] <= (r.max ?? Infinity);
    });
  }

  public getTag(kind: DeckKind): string {
    return KIND_MAP[kind];
  }

  public toggleDetails(name: string): void {
    this.opened = this.opened === name ? '' : name;
  }

  public remove(name: string): void {
    this.store.removeDeck(name);
  }
}
</script>

<style lang="scss" scoped>
.panel-block {
  color: var(--text-color);
  gap: 5px;

  &:not(:last-child) {
    border-bottom-color: var(--border-color);
  }
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

  span {
    flex: 1 1 0px;
    align-self: center;

    .tag {
      color: var(--secondary);
      background-color: var(--primary);
    }

    strong {
      color: var(--text-color);
    }
  }
}

.empty {
  height: calc(60vh + 7em);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  .actions {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
}

.deck-list {
  height: calc(60vh + 3.5em);
  overflow: scroll;
  border-bottom: 1px solid var(--border-color);
}
</style>
