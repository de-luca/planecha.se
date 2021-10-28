<template>
  <button class="button is-warn" @click="opened = true">
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
          <button class="button is-danger" @click="close">
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
import { useMain } from '@/store/main';
import { Vue } from 'vue-class-component';

export default class CloseGame extends Vue {
  private store = useMain();
  private opened = false;

  public get online(): boolean {
    return this.store.online;
  }

  public async close(): Promise<void> {
    await this.$router.push('/');
    this.store.leave();
  }
}
</script>

<style lang="scss" scoped>
button {
  height: 100%;

  &.is-warn {
    color: var(--btn-warn-color);
    background-color: var(--btn-warn-bg);
    border-color: var(--btn-warn-border);

    &:hover {
      color: var(--btn-warn-color);
      background-color: var(--btn-warn-hover-bg);
    }

    &:active {
      color: var(--btn-warn-color);
      background-color: var(--btn-warn-active-bg);
    }
  }

  &.is-danger {
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
    color: var(--text-color);
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
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

    button.button {
      margin-right: 0;
      flex: 1 1 0px;
    }
  }
}
</style>
