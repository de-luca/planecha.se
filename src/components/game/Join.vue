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
      <div v-if="error && !preflightData" class="error">
        <a class="button is-large is-ghost">
          <fa icon="exclamation" fixed-width />
        </a>
        <p><b v-html="error.message"></b></p>
        <p v-html="error.cause"></p>
      </div>

      <form v-else @submit.prevent="join">
        <div class="content">
          <h3>
            Game type: <i>{{ preflightData?.mapType }}</i>
          </h3>
          <div class="game-status">
            <h4 class="has-started">
              Game has {{ !preflightData?.hasStarted ? 'not yet' : '' }} started.
            </h4>
            <div class="player-list">
              <h4>Present players:</h4>
              <ul>
                <li v-for="player in preflightData?.players" v-bind:key="player">{{ player }}</li>
              </ul>
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

        <div class="field join-game">
          <div class="control">
            <button
              class="button is-primary"
              :class="{ 'is-loading': joining }"
              :disabled="joining"
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
import { PreflightPayload, useMain } from '#/store/main';

import NameInput from '#/components/controls/NameInput.vue';
import BrandedFooter from '#/components/BrandedFooter.vue';

@Component({ components: { BrandedFooter, NameInput } })
export default class Join extends Vue {
  private store = useMain();

  public loading = true;
  public name = useMain().selfName ?? '';
  public roomId = '';
  public joining = false;

  public preflightData: PreflightPayload | null = null;
  public error: Error | null = null;

  public created(): void {
    this.roomId = this.$route.params.roomId as string ?? '';
    this.store.preJoin(this.roomId)
      .then(data => this.preflightData = data!)
      .catch(err => {
        this.store.leave();
        this.error = err as Error;
      })
      .finally(() => this.loading = false);
  }

  public async join() {
    this.joining = true;
    this.store.setName(this.name);
    try {
      await this.store.join();
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
