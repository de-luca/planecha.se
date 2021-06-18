<template>
  <div>
    <template v-for="m in messages.slice().reverse()" :key="m">
      <p v-html="m"></p>
    </template>
  </div>
</template>

<script lang="ts">
import { Store, useStore } from '@/store';
import { Vue } from 'vue-class-component';

export default class Feed extends Vue {
  public store: Store;

  public get messages(): Array<string> {
    return this.store.getters.feed;
  }

  public created() {
    this.store = useStore();
  }
}
</script>

<style lang="scss" scoped>
</style>
