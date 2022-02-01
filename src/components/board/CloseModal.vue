<template>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <p class="subtitle">
          Do you wish to {{ online ? 'leave' : 'close' }} the game?
        </p>
        <div class="buttons">
          <button class="button is-danger" @click="$emit('close')">
            {{ online ? 'Leave' : 'Close' }} Game
          </button>
          <button class="button is-light" @click="$emit('dismiss')">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';

class Props {
  public online = prop<boolean>({ required: true });
}

@Options({ emits: ['dismiss', 'close'] })
export default class CloseModal extends Vue.with(Props) {
}
</script>

<style lang="scss" scoped>
button {
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

.modal-content {
  max-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: .5rem;
  margin: 0 auto;

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
