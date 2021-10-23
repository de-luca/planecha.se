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
      </div>

      <div class="field join-game">
        <div class="control">
          <button
            class="button is-primary"
            :class="{ 'is-loading': joining }"
            type="submit"
          >
            Join game
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { ActionTypes, Store, useStore } from '@/store';
import { Options, Vue } from 'vue-class-component';

import ThemeSelector from '@/components/ThemeSelector.vue';

@Options({ components: { ThemeSelector } })
export default class JoinGame extends Vue {
  private store: Store;
  private roomId: string;
  private name: string;
  private joining: boolean = false;

  public created() {
    this.store = useStore();
    this.roomId = this.$route.params.roomId as string ?? '';
    this.name = '';
  }

  public async join() {
    this.joining = true;
    await this.store.dispatch(ActionTypes.JOIN, { roomId: this.roomId, name: this.name });
    this.joining = false;

    this.$router.push('/board');
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
  height: 100vh;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.field.join-game button {
  width: var(--form-btn-width);
}
</style>
