<template>
  <div class="wrapper">
    <reload-prompt/>

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
      <name-input
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
  </div>

  <branded-footer />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { useMain } from '#/store/main';

import NameInput from '#/components/controls/NameInput.vue';
import BrandedFooter from '#/components/BrandedFooter.vue';
import ReloadPrompt from '#/components/ReloadPrompt.vue';

@Component({ components: { BrandedFooter, NameInput, ReloadPrompt } })
export default class Join extends Vue {
  private store = useMain();

  public name = useMain().selfName ?? '';
  public roomId = '';
  public joining = false;

  public error: Error | null = null;

  public created(): void {
    this.roomId = this.$route.params.roomId as string ?? '';
  }

  public async join() {
    this.joining = true;
    this.store.setName(this.name);
    try {
      await this.store.join({ roomId: this.roomId, name: this.name });
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

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
