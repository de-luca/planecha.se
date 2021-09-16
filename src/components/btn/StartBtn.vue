<template>
  <button
    class="button is-light is-rounded"
    title="Start Game"
    @click="start"
  >
    <font-awesome-icon icon="play-circle" size="6x" />
  </button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({ emits: [ 'start' ] })
export default class StartBtn extends Vue {
  public start(): void {
    this.$emit('start');
  }
}
</script>
