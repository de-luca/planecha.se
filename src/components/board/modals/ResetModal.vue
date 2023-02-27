<template>
  <div class="modal" :class="{ active }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <p class="subtitle">
          Do you wish to reset the game?
        </p>
        <p>
          The current game will be discarded and a new shuffled deck will be used.
        </p>
        <div class="buttons">
          <button class="button is-warn" @click="$emit('close')">
            Reset Game
          </button>
          <button class="button is-light" @click="$emit('update:active', false)">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';

@Component({ emits: ['update:active', 'close'] })
export default class ResetModal extends Vue {
  @Prop({ required: true })
  public active: boolean;
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

.modal.active {
  display: block;
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

    p {
      margin-bottom: 1.5rem;
    }
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
