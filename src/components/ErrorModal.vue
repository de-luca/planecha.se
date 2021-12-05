<template>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <h1 class="subtitle has-text-danger">
          <fa icon="exclamation-circle" size="3x" fixed-width />
        </h1>
        <h2 class="subtitle">{{ error.name }}</h2>
        <p class="content" v-html="error.message"></p>
        <button class="button is-secondary" @click="$emit('dismiss')">
          Okay
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';

class Props {
  public error = prop<Error>({ required: true });
}

@Options({ emits: ['dismiss'] })
export default class ErrorModal extends Vue.with(Props) {}
</script>

<style lang="scss" scoped>
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
