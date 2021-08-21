<template>
  <button class="button is-light is-warning" @click="opened = true">
    {{ online ? 'Leave' : 'Close' }} Game
  </button>

  <div class="modal" :style="{ display: (opened ? 'block' : 'none' ) }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <p class="subtitle">
          Do you wish to {{ online ? 'leave' : 'close' }} the game?
        </p>
        <div class="buttons">
          <button class="button is-danger is-light" @click="close">
            {{ online ? 'Leave' : 'Close' }} Game
          </button>
          <button class="button is-light" @click="opened = false">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MutationTypes, Store, useStore } from '@/store';
import { Vue } from 'vue-class-component';

export default class CloseGame extends Vue {
  private store: Store;
  private opened = false;

  public created(): void {
    this.store = useStore();
  }

  public get online(): boolean {
    return this.store.getters.online;
  }

  public async close(): Promise<void> {
    await this.$router.push('/');
    this.store.commit(MutationTypes.LEAVE);
  }
}
</script>

<style lang="scss" scoped>
button {
  height: 100%;
}

.modal {
  display: block;
}

.modal-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .box {
    text-align: center;
  }

  & > * {
    width: 100%;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: .5rem;

    button {
      flex-grow: 1;
    }
  }
}
</style>
