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

    <form @submit.prevent="join">
      <div class="field">
        <label class="label">Game ID:</label>
        <div class="control">
          <input
            v-model="roomId"
            class="input"
            type="text"
            placeholder="WhatAGreatGameIdHere"
            required
            @blur="parse"
          >
        </div>
        <p class="help">That's the part your friend should give you.</p>
      </div>

      <div class="field">
        <label class="label">Your player name:</label>
        <div class="control">
          <input
            v-model="name"
            class="input"
            type="text"
            placeholder="Super Cake"
            required
          >
        </div>
        <p class="help">The name people in the game will see you as.</p>
        <label class="checkbox">
          <input type="checkbox" v-model="saveName"> Save name for future online games
        </label>
      </div>

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
      </div>
    </form>
  </div>

  <branded-footer />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { useMain } from '@/store/main';
import { useConfig } from '@/store/config';

import BrandedFooter from '@/components/BrandedFooter.vue';

const URL_REGEX = /https?:\/\/.+\/#\/join\/(?<room>[[0-9a-zA-Z]]{20})/;

@Component({ components: { BrandedFooter } })
export default class JoinGame extends Vue {
  private mainStore = useMain();
  private configStore = useConfig();

  public roomId = '';
  public name = '';
  public saveName = false;
  public joining = false;

  public error: Error | null = null;

  public created() {
    this.roomId = this.$route.params.roomId as string ?? '';
    this.name = this.configStore.name ?? '';
    this.saveName = this.name !== '';
  }

  public parse(): void {
    const match = this.roomId.match(URL_REGEX);
    if (match && match.groups?.room) {
      this.roomId = match.groups?.room;
    }
  }

  public async join() {
    this.joining = true;

    this.saveName
      ? this.configStore.setName(this.name)
      : this.configStore.removeName();

    try {
      await this.mainStore.join({ roomId: this.roomId, name: this.name });
      this.$router.push('/board');
    } catch (err) {
      this.error = err as Error;
    }

    this.joining = false;
  }
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;

 .brand {
    align-self: center;
    margin-right: 1rem;
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
}

input.input {
  width: calc(2 * var(--form-btn-width) + 1rem);
}

.field.join-game {
  margin-bottom: 1rem;

  button {
    @media screen and (max-width: 480px) {
      & {
        width: 100%;
      }
    }
    width: var(--form-btn-width);
  }

  .control {
    display: flex;
  }
}
</style>
