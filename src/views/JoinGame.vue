<template>
  <div class="container">
    <div class="title">
      <router-link class="brand" to="/">⟁</router-link>
      <div>
        <h1>JOIN GAME</h1>
        <h2 class="subtitle">
          or <router-link to="/create">Create a game</router-link>
        </h2>
      </div>
      <theme-selector />
    </div>

    <form @submit.prevent="join">
      <div class="field">
        <label class="label">Game ID:</label>
        <div class="control">
          <input
            v-model="roomId"
            class="input"
            type="text"
            placeholder="00000000-0000-0000-0000-000000000000"
            required
            pattern="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
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
            :disabled="!available"
            type="submit"
          >
            Join game
          </button>
        </div>
        <p class="help" v-html="helpText"></p>
      </div>
    </form>

    <error-modal v-if="error" :error="error" @dismiss="error = null" />
  </div>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import { useMain } from '@/store/main';
import { useConfig } from '@/store/config';
import { Onlineable } from '@/components/Onlineable';

import ThemeSelector from '@/components/ThemeSelector.vue';
import ErrorModal from '@/components/ErrorModal.vue';

@Options({ components: { ThemeSelector, ErrorModal } })
export default class JoinGame extends mixins(Onlineable) {
  private static readonly urlRegex =
    /https?:\/\/.+\/#\/join\/(?<room>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/;

  private mainStore = useMain();
  private configStore = useConfig();

  private roomId: string = '';
  private name: string = '';
  private saveName: boolean = false;
  private joining: boolean = false;

  private error: Error | null = null;

  public created() {
    this.roomId = this.$route.params.roomId as string ?? '';
    this.name = this.configStore.name ?? '';
    this.saveName = this.name !== '';
    this.registerOnlineListener();
  }

  public unmounted(): void {
    this.removeOnlineListener();
  }

  public parse(): void {
    const match = this.roomId.match(JoinGame.urlRegex);
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

  div:first-of-type {
    flex-grow: 1;
  }

  .theme-selector {
    align-self: flex-start;
  }
}

.container {
  width: 800px;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.field.join-game button {
  width: var(--form-btn-width);
}
</style>
