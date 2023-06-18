<template>
  <div class="modal" style="display: flex">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <p class="subtitle">Deck Name</p>
        <form @submit.prevent="$emit('done', deckName)">
          <div class="field">
            <p class="control">
              <input
                class="input"
                type="text"
                placeholder="Deck name"
                required
                v-model="deckName"
              >
            </p>
            <p v-if="alreadyExists" class="help is-warning">A deck with this name already exists.</p>
          </div>
          <div class="field submit">
            <div class="control">
              <button
                class="button is-secondary"
                @click.prevent="$emit('cancel')"
              >Cancel</button>
            </div>
            <div class="control">
              <button class="button is-primary" type="submit">
                {{ alreadyExists ? 'Replace deck' : 'Save deck' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { useMain } from '#/store/main';

@Component({
  emits: ['done', 'cancel'],
})
export default class NameModal extends Vue {
  private store = useMain();
  public deckName: string;

  public get alreadyExists(): boolean {
    return this.store.decks.has(this.deckName);
  }
}
</script>

<style lang="scss" scoped>
.modal {
  left: 0;
  right: 0;
}

.modal-content {
  max-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: .5rem;
  margin: 0 auto;

  .subtitle {
    text-align: center;
  }

  .submit {
    display: flex;
    flex-direction: row;
    justify-content: end;
    gap: .5rem;
  }

  .box {
    color: var(--text-color);
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
  }

  & > * {
    width: 100%;
  }
}
</style>
