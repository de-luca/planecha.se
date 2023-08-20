<template>
  <div class="wrapper">
    <div class="title">
      <router-link class="brand" title="Back Home" to="/">⟁</router-link>
      <div>
        <h1>JOIN GAME</h1>
        <h2 class="subtitle">
          or <router-link to="/create">Create a game</router-link>
        </h2>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <a class="button is-large is-ghost is-loading"></a>
      <p><b>Looking for game...</b></p>
    </div>

    <template v-else>
      <div v-if="error && !gameData" class="error">
        <a class="button is-large is-ghost">
          <fa icon="exclamation" fixed-width />
        </a>
        <p><b v-html="error.message"></b></p>
        <p v-html="error.cause"></p>
      </div>

      <form v-else @submit.prevent="join">
        <div class="content">
          <h3>
            Game type: <b>{{ gameType }}</b>
          </h3>
          <div class="game-status">
            <div class="player-count">
              <h4>Present players: <b>{{ gameData?.peers }}</b></h4>
            </div>
          </div>
        </div>

        <name-input
          class="name-input"
          v-model="name"
          label="Your player name:"
          help="The name people in the game will see you as."
          required
        ></name-input>

        <div v-if="isMulti" class="field">
          <div class="control main">
            <button class="button is-secondary" @click.prevent="toggleDeckBuilder">
              Open deck customization
            </button>
          </div>
          <p class="help is-danger" v-if="!isDeckValid.valid">
            <fa icon="exclamation" fixed-width shake />
            To join you'll need to pick a 10 cards Planar Deck
            ({{ isDeckValid.reqs.map(r => r.text).join(' - ') }})
          </p>
        </div>

        <deck-customization
          v-if="isMulti && openDeckBuilder"
          @cancel="openDeckBuilder = false"
          @use="setDeck"
          :reqs="{ mapType: gameData?.data.mapType }"
        />

        <div class="field join-game">
          <div class="control">
            <button
              class="button is-primary"
              :class="{ 'is-loading': joining }"
              :disabled="joining || !isDeckValid.valid"
              type="submit"
            >
              Join game
            </button>
          </div>
          <p class="help is-danger" v-if="error" v-html="error.message"></p>
        </div>
      </form>
    </template>
  </div>

  <branded-footer />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { DeckState, getDeckState } from '../create/utils';
import { MainStore, useMain } from '#/store/main';
import { MapType } from '#/model/map';
import { Card } from '#/model/card';

import NameInput from '#/components/controls/NameInput.vue';
import BrandedFooter from '#/components/BrandedFooter.vue';
import DeckCustomization from '#/components/create/DeckCustomization.vue';

@Component({ components: { BrandedFooter, DeckCustomization, NameInput } })
export default class Join extends Vue {
  private store = useMain();

  public loading = true;
  public name = useMain().selfName ?? '';
  public roomId = '';
  public joining = false;
  public openDeckBuilder = false;
  public deck: Array<Card> = [];

  public gameData: Awaited<ReturnType<MainStore['preJoin']>> | null = null;
  public error: Error | null = null;

  public created(): void {
    this.roomId = this.$route.params.roomId as string ?? '';
    this.store.preJoin(this.roomId)
      .then(data => this.gameData = data)
      .catch(err => {
        this.store.leave();
        this.error = err as Error;
      })
      .finally(() => this.loading = false);
  }

  public get gameType(): string {
    switch (this.gameData?.data?.mapType) {
      case MapType.SINGLE:
        return 'Single Deck';
      case MapType.MULTI:
        return 'Multiple Decks';
      case MapType.ETERNITIES:
        return 'Eternities Map';
    }
    return '';
  }

  public get isMulti(): boolean {
    return this.gameData?.data?.mapType === MapType.MULTI;
  }

  public get isDeckValid(): DeckState {
    return !this.isMulti
      ? { valid: true, reqs: [] }
      : getDeckState(this.gameData!.data.mapType, this.deck);
  }

  public toggleDeckBuilder(): void {
    this.openDeckBuilder = !this.openDeckBuilder;
  }

  public setDeck(deck: Array<Card>): void {
    this.openDeckBuilder = false;
    this.deck = deck;
  }

  public async join() {
    this.joining = true;
    this.store.setName(this.name);
    try {
      await this.store.join({
        type: this.gameData!.data.mapType,
        cards: this.deck.map(c => c.id),
      });
    } catch (err) {
      this.store.leave();
      this.error = err as Error;
    }
    this.joining = false;
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;

 .brand {
    display: inline-block;
    font-size: 6rem;
    color: var(--brand-color-primary);
    &:hover {
      color: var(--brand-color-secondary);
    }
  }
}

.wrapper {
  padding: 1rem;
  margin: 0 auto;
  position: relative;
  width: auto;
  max-width: 800px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error {
  text-align: center;
  a.button.is-ghost {
    color: hsl(348, 86%, 61%);
  }
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .status {
    width: 100%;
    text-align: initial;
  }

  .content {
    width: 100%;

    h3, h4 {
      color: var(--text-color);
    }

    .game-status {
      display: flex;
      flex-direction: row;
      justify-content: space-between;


      .has-started {
        width: 100%;
      }

      .player-list {
        width: 100%;
        text-align: right;
        h4 {
          margin-bottom: 0;
        }
        ul {
          margin-top: .5em;
          list-style-type: none;
        }
      }
    }
  }
}

.field {
  width: 100%;
  margin-bottom: 1rem;

  input.input {
    width: 100%;
  }

  button {
    width: 100%;
  }

  .control {
    display: flex;
  }
}
</style>
